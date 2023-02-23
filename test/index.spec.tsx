import React from 'react';
import XMLToReact from '../src/index';
import {expect} from 'chai';
import * as enzyme from 'enzyme';

function MyListItem({children, i}: {children: Array<HTMLElement>, i: number}): JSX.Element {
  return (<li data-i={i}>{children}</li>);
}

describe('XmlToReact', () => {
  it('convert : readme example', () => {
    const xmlToReact = new XMLToReact({
      Example: (attrs) => ({type: 'ul', props: attrs}),
      Item: (attrs) => ({type: MyListItem, props: attrs})
    });

    const reactTree = xmlToReact.convert(
      `<Example name="simple">
    <Item i="1">one</Item>
    <Item>two</Item>
    <Item>three</Item>
  </Example>`);

    const wrapper = enzyme.shallow(reactTree);
    expect(wrapper.find(MyListItem)).to.have.length(3);
  });

  it('convert : xml is not a string - returns null', () => {
    const xmlToReact = new XMLToReact({
      Example: (attrs) => ({type: 'ul', props: attrs}),
      Item: (attrs) => ({type: MyListItem, props: attrs})
    });

    expect(xmlToReact.convert({})).to.be.equal(null);
  });

  it('convert : invalid xml - return null', () => {
    const xmlToReact = new XMLToReact({
      div: (attrs) => ({type: 'div', props: attrs}),
      span: (attrs) => ({type: 'span', props: attrs})
    });

    expect(xmlToReact.convert('<div>hello')).to.be.equal(null);
  });

  it('convert : empty converters', () => {
    const xmlToReact = new XMLToReact({});

    const reactTree = xmlToReact.convert('<div><span>hello><span>world</span></div>');

    expect(reactTree).to.be.null;
  });

});
