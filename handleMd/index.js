const fs = require('fs');
const db = require('../db/index');
const path = require('path');


//处理头部字段数据
const handleData = (data, index) => {
    let temp = index;
    while(data[index] !== '\n' && data[index] !== '\r') {
        index++;
    }
    return data.slice(temp, index);
}

//处理markdown数据，将title，category，date以及content分离出来
const getData = (data) => {
    const str = data.toString();
    //使用正则表达式，来分离要得到的字符串
    const reg = /---/g;
    const titleReg = /title/g;
    const categoryReg = /category/g;
    const dateReg = /date/g;
    const categoryNameReg = /name/g;

    //获取文章头部介绍信息
    const desStart = reg.exec(str).index;
    const desEnd = reg.exec(str).index;
    const desData = str.slice(desStart, desEnd);

    const titleExec = titleReg.exec(desData);
    const dateExec = dateReg.exec(desData);
    const categoryExec = categoryReg.exec(desData);
    const categoryNameExec = categoryNameReg.exec(desData);

    const articleTitle = titleExec && handleData(desData, titleExec.index + 7);
    const articleDate = dateExec && handleData(desData, dateExec.index + 6);
    const articleCategory = categoryExec && handleData(desData, categoryExec.index + 10);
    const categoryName = categoryNameExec && handleData(desData, categoryNameExec.index + 6);
    const articleContent = str.slice(desEnd + 3);
    
    return {
        articleCategory,
        articleContent,
        articleDate,
        articleTitle,
        categoryName
    }
}

//处理数据库，清空数据库，并将markdown文件的数据导入数据库
const handleDB = () => {
    //清空article表
    const clearArticle = 'truncate table articles';
    db.query(clearArticle, (err) => {
        if(err) {
            console.log(err.message);
        }
    });

    //清空categories表
    const clearCategoris = 'truncate table categories';
    db.query(clearCategoris, (err) => {
        if(err) {
            console.log(err.message);
        }
    });
}

//读取文章文件内容，并将其插入数据库
function parseArticle(path) {
    const data = fs.readFileSync(path);

    const res = getData(data);

    //获取处理过后的数据
    let { articleCategory, articleContent, articleDate, articleTitle } = res;

    // 将其插入数据库
    const sql = 'insert into articles (title, date, category, content) values(?,?,?,?) ';
    const insertValue = [articleTitle, articleDate, articleCategory, articleContent];
    db.query(sql, insertValue, (err) => {
        if(err) {
            console.log(err.message);
        }
    })
}

//读取目录文件内容，并将其插入数据库
function parseCategories(path) {
    const data = fs.readFileSync(path);

    const res = getData(data);

    const { categoryName } = res;

    const sql = 'insert into categories (name) values(?) ';
    const insertValue = categoryName;
    db.query(sql, insertValue, (err) => {
        if(err) {
            console.log(err);
        }
    })
}


function parse() {

    //初始化数据库
    handleDB();

    //获取markdown文章的目录路径
    const articlesPath = path.join(__dirname, '../articles');
    //同步读取目录下的所有文件
    const articles = fs.readdirSync(articlesPath);
    //将得到的数据插入数据库
    articles.forEach(article => {
        const filePath = path.join(articlesPath, article);
        parseArticle(filePath);
    });

    const categoriesPath = path.join(__dirname, '../categories');
    const categories = fs.readdirSync(categoriesPath);
    categories.forEach(category => {
        const filePath = path.join(categoriesPath, category);
        parseCategories(filePath);
    })
}

module.exports = parse;