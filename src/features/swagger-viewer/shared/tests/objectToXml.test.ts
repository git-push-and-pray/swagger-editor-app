import { describe, expect, it } from 'vitest';

import { objectToXml } from '../utils/objectToXml';

describe('objectToXml', () => {
  describe('primitive values', () => {
    it('should convert string to XML', () => {
      const result = objectToXml('Hello World', 'message');

      expect(result).toBe('<message>Hello World</message>');
    });

    it('should convert number to XML', () => {
      const result = objectToXml(42, 'count');

      expect(result).toBe('<count>42</count>');
    });

    it('should convert boolean to XML', () => {
      const result = objectToXml(true, 'active');

      expect(result).toBe('<active>true</active>');
    });

    it('should convert null to self-closing tag', () => {
      const result = objectToXml(null, 'empty');

      expect(result).toBe('<empty/>');
    });

    it('should convert undefined to self-closing tag', () => {
      const result = objectToXml(undefined, 'empty');

      expect(result).toBe('<empty/>');
    });
  });

  describe('objects', () => {
    it('should convert simple object to XML', () => {
      const obj = { name: 'John', age: 30 };
      const result = objectToXml(obj, 'user');

      expect(result).toBe(`<user>
  <name>John</name>
  <age>30</age>
</user>`);
    });

    it('should convert nested object to XML', () => {
      const obj = {
        user: {
          name: 'John',
          address: {
            city: 'NYC',
            zip: '10001',
          },
        },
      };
      const result = objectToXml(obj, 'root');

      expect(result).toBe(`<root>
  <user>
    <name>John</name>
    <address>
      <city>NYC</city>
      <zip>10001</zip>
    </address>
  </user>
</root>`);
    });

    it('should convert empty object to self-closing tag', () => {
      const result = objectToXml({}, 'empty');

      expect(result).toBe('<empty/>');
    });

    it('should convert object with multiple properties', () => {
      const obj = {
        id: 1,
        name: 'Product',
        price: 99.99,
        inStock: true,
      };
      const result = objectToXml(obj, 'product');

      expect(result).toBe(`<product>
  <id>1</id>
  <name>Product</name>
  <price>99.99</price>
  <inStock>true</inStock>
</product>`);
    });

    it('should handle object with null values', () => {
      const obj = { name: 'John', age: null, city: 'NYC' };
      const result = objectToXml(obj, 'user');

      expect(result).toBe(`<user>
  <name>John</name>
  <age/>
  <city>NYC</city>
</user>`);
    });

    it('should handle object with undefined values', () => {
      const obj = { name: 'John', age: undefined, city: 'NYC' };
      const result = objectToXml(obj, 'user');

      expect(result).toBe(`<user>
  <name>John</name>
  <age/>
  <city>NYC</city>
</user>`);
    });
  });

  describe('arrays', () => {
    it('should convert array of primitives to XML', () => {
      const result = objectToXml([1, 2, 3, 4, 5], 'numbers');

      expect(result).toBe(`<numbers>1</numbers>
<numbers>2</numbers>
<numbers>3</numbers>
<numbers>4</numbers>
<numbers>5</numbers>`);
    });

    it('should convert array of objects to XML', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];
      const result = objectToXml(users, 'user');

      expect(result).toBe(`<user>
  <id>1</id>
  <name>John</name>
</user>
<user>
  <id>2</id>
  <name>Jane</name>
</user>`);
    });

    it('should convert empty array to self-closing tag', () => {
      const result = objectToXml([], 'empty');

      expect(result).toBe('<empty/>');
    });

    it('should convert array with nested objects', () => {
      const data = [
        { id: 1, items: [{ name: 'Item1' }, { name: 'Item2' }] },
        { id: 2, items: [{ name: 'Item3' }] },
      ];
      const result = objectToXml(data, 'entry');

      expect(result).toBe(`<entry>
  <id>1</id>
  <items>
    <name>Item1</name>
  </items>
  <items>
    <name>Item2</name>
  </items>
</entry>
<entry>
  <id>2</id>
  <items>
    <name>Item3</name>
  </items>
</entry>`);
    });

    it('should handle array with mixed types', () => {
      const result = objectToXml([1, 'two', true, null], 'items');

      expect(result).toBe(`<items>1</items>
<items>two</items>
<items>true</items>
<items/>`);
    });
  });

  describe('complex structures', () => {
    it('should convert nested arrays and objects', () => {
      const data = {
        name: 'Root',
        children: [
          { id: 1, value: 'First' },
          { id: 2, value: 'Second' },
        ],
        metadata: {
          created: '2024-01-01',
          tags: ['tag1', 'tag2'],
        },
      };
      const result = objectToXml(data, 'root');

      expect(result).toContain('<root>');
      expect(result).toContain('<name>Root</name>');
      expect(result).toContain('<children>');
      expect(result).toContain('<id>1</id>');
      expect(result).toContain('<value>First</value>');
      expect(result).toContain('<metadata>');
      expect(result).toContain('<created>2024-01-01</created>');
      expect(result).toContain('<tags>tag1</tags>');
      expect(result).toContain('<tags>tag2</tags>');
    });

    it('should use custom root tag', () => {
      const obj = { name: 'Test' };
      const result = objectToXml(obj, 'customRoot');

      expect(result).toBe(`<customRoot>
  <name>Test</name>
</customRoot>`);
    });

    it('should handle deep nesting with indentation', () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
              },
            },
          },
        },
      };
      const result = objectToXml(obj, 'root');

      expect(result).toContain('<level1>');
      expect(result).toContain('  <level2>');
      expect(result).toContain('    <level3>');
      expect(result).toContain('      <level4>');
      expect(result).toContain('        <value>deep</value>');
    });
  });

  describe('special characters', () => {
    it('should escape special characters in tag names', () => {
      const obj = { 'special-key': 'value' };
      const result = objectToXml(obj, 'root');

      expect(result).toBe(`<root>
  <special-key>value</special-key>
</root>`);
    });

    it('should handle numbers as tag names (should work as strings)', () => {
      const obj = { '123': 'numeric-key' };
      const result = objectToXml(obj, 'root');

      expect(result).toBe(`<root>
  <123>numeric-key</123>
</root>`);
    });

    it('should handle special characters in values', () => {
      const obj = { message: 'Hello & Goodbye <test>' };
      const result = objectToXml(obj, 'root');

      expect(result).toBe(`<root>
  <message>Hello & Goodbye <test></message>
</root>`);
    });
  });

  describe('edge cases', () => {
    it('should handle primitive with custom indent', () => {
      const result = objectToXml('test', 'value', 3);

      expect(result).toBe('      <value>test</value>');
    });

    it('should handle boolean false value', () => {
      const result = objectToXml(false, 'active');

      expect(result).toBe('<active>false</active>');
    });

    it('should handle zero value', () => {
      const result = objectToXml(0, 'count');

      expect(result).toBe('<count>0</count>');
    });

    it('should handle empty string value', () => {
      const result = objectToXml('', 'value');

      expect(result).toBe('<value></value>');
    });
  });
});
