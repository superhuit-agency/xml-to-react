 import React from 'react';
import {DOMParser} from '@xmldom/xmldom'

export default class XMLToReact {
    private _converters: object;
    private _parser: DOMParser;

    constructor(converters: object) {
        this._converters = converters;
        this._parser = new DOMParser({errorHandler: (msg) => {throw new Error(msg)}});

    }

    convert(xml: string, data?: object): React.ReactElement<any> | null {
        if (typeof xml !== 'string')
        return null;

        let tree: Document;
        try {
            tree = this._parser.parseFromString(xml, 'text/xml');
        }
        catch (e) {
            console.warn('XMLToReact: Unable to parse invalid XML input. Please input valid XML.');
            return null;
        }

        const result = this._visitNode(tree.documentElement, 0, this._converters, data);

        if (typeof result === 'string')
            return null;

        return result;    
    }

    private _visitNode(node: HTMLElement, index: number, converters: any, data?: object): React.ReactElement | string | null {
        if (!node)
            return null;
    
        const tagName = node.tagName;
        const nodeType = node.nodeType;
    
        if (nodeType === 3)
            return node.nodeValue;
    
        if (!tagName)
            return null;
    
        const converter = converters[tagName];
    
        if (typeof converter !== 'function') 
            return null;
    
        const attributes = this._getAttributes(node);
    
        const _coverter = converter(attributes, data);
        const type = _coverter.type;
        const props = _coverter.props;
    
        const newProps = {...{key: index}, ...props};
    
        const children = this._getChildren(node);
        const childElements = children.map((child: any, childIndex: any) =>
            this._visitNode(child, childIndex, converters, data)
        );
    
        return React.createElement.apply(undefined, [type, newProps, ...this._toConsumableArray(childElements)]);
    }

    private _getAttributes(node: any): any {
        if (!node)
            return {};
    
        const attributes = node.attributes;
    
        if (!attributes || !attributes.length)
            return {};
    
        return Array.from(attributes).reduce((results: any, attr: any) => {
            const name: string = attr['name'];
            const value: any = attr['value'];
    
            results[name] = value;
            return results;
        }, {});
    }
    
    private _getChildren(node: any): any {
        if (!node)
            return [];
    
        var children = node.childNodes;
    
        if (!children)
            return [];
    
        return children.length ? Array.from(children) : [];
    }
    
    private _toConsumableArray(arr : any) : any[] {
        if (Array.isArray(arr))
            return [...arr];
        else
            return Array.from(arr);
    }
    
    
}