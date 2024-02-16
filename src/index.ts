import React from "react";
import { DOMParser } from "@xmldom/xmldom";

interface Converters {
  // Define the shape of your converter functions here
  [key: string]: (node: any, index: number) => any; // Replace `any` with the actual types if known
}

export default class XMLToReact {
  _converters: Converters;
  _parser: DOMParser;

  constructor(converters: Converters) {
    this._converters = converters;
    this._parser = new DOMParser({
      errorHandler: (msg) => {
        throw new Error(msg);
      },
    });
  }

  convert(xml: string, data?: any): React.ReactElement<Element> | null {
    if (typeof xml !== "string") return null;

    let tree: Document;
    try {
      tree = this._parser.parseFromString(xml, "text/xml");
    } catch (e) {
      console.warn(
        "XMLToReact: Unable to parse invalid XML input. Please input valid XML."
      );
      return null;
    }

    const result = this._visitNode(
      tree.documentElement,
      0,
      this._converters,
      data
    );

    if (typeof result === "string") return null;

    return result;
  }

  private _visitNode(
    node: HTMLElement,
    index: number,
    converters: object,
    data?: object
  ): React.ReactElement | string | null {
    if (!node) return null;

    const tagName: string = node.tagName;
    const nodeType: number = node.nodeType;

    if (nodeType === 3) return node.nodeValue;

    if (!tagName) return null;

    const converter = converters[tagName];

    if (typeof converter !== "function") return null;

    const attributes = this._getAttributes(node);

    const _coverter = converter(attributes, data);
    const type = _coverter.type;
    const props = _coverter.props;

    const newProps = { ...{ key: index }, ...props };

    const children = this._getChildren(node);
    const childElements = children.map(
      (child: HTMLElement, childIndex: number) =>
        this._visitNode(child, childIndex, converters, data)
    );

    return React.createElement.apply(undefined, [
      type,
      newProps,
      ...Array.from(childElements),
    ]);
  }

  private _getAttributes(node: HTMLElement): object {
    if (!node) return {};

    const attributes = node.attributes;

    if (!attributes || !attributes.length) return {};

    return Array.from(attributes).reduce((results: object, attr: Attr) => {
      const name: string = attr["name"];
      const value: string = attr["value"];

      results[name] = value;
      return results;
    }, {});
  }

  private _getChildren(node: HTMLElement): Array<HTMLElement> {
    if (!node) return [];

    const children = node.childNodes;

    if (!children) return [];

    return children.length ? (Array.from(children) as Array<HTMLElement>) : [];
  }
}
