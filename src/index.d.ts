declare module "XMLToReact" {
  import React from "react";

  interface Converters {
    [key: string]: (node: any, index: number) => any;
  }

  export default class XMLToReact {
    constructor(converters: Converters);
    convert(xml: string, data?: any): React.ReactElement<Element> | null;
  }
}
