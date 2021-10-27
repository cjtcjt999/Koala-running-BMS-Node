function setQuerySql(sql, paramsObj) {
    let setWhere = false;
    let paramsArr = [];
    let paramsName = [];
    for(let i in paramsObj) {
        if (paramsObj[i]) {
            paramsArr.push(paramsObj[i])
            paramsName.push(i)
            setWhere = true;
        }
    }
    if (setWhere) {
        sql += ' WHERE '
    }
    paramsName.forEach(item => {
        sql += (item + ' = ? and ');
    })
    if (sql.substring(sql.length - 4) === 'and ') {
        sql = sql.slice(0, -4)
    }
    return { sql, paramsArr }
  }
  module.exports = { setQuerySql };