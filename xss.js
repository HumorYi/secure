// 有一个xss库，可以满足大部分需求
// const xss = require("xss");
// let html = xss('<script>alert("xss");</script>');
// console.log(html);

// 定制xss
// 把html字符串解析为语法树，类似JQ
const cheerio = require('cheerio')

let whiteTags = {
 a: [ 'href', "title", "target" ],
 style: [ 'src' ],
 link: [ 'src' ],
 script: [ 'src' ],
 iframe: [ 'src' ],
 frame: [ 'src' ],
 img: [ 'src' ],
 font: [ 'color', 'size' ],
}

module.exports = {
  // html属性值要以双引号包裹，避免插入空格和不使用引号包裹的HTML属性代码
  escape(html) {
    if (!html) return '';

    return html.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quto;')
      .replace(/'/g, '&#39;')
  },
  filter(html) {
   if (!html)  return ''

   let $ = cheerio(html)

   $('*').foreach((index, elem) => {
    let $elem = $(elem)
    let elemAttribs = elem.attribs
    let whiteTag = whiteTags[elem.name]

    if (!whiteTag) {
     $elem.remove();
     return;
    }

    for (let attr in elemAttribs) {
      !whiteTag.includes(attr) && $elem.attr(attr, null)
    }
   })

   return $.html()
  },
  response(data) {
    return JSON.stringify(data)
  }
}