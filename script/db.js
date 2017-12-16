function init_db(){
  var db = api.require('db');//引入数据库模块
  db.openDatabase({//打开数据库
      name: 'dyz'
  }, function(ret, err) {
      if (ret.status) {//成功打开数据库
          // db.selectSql({
          //   name: 'dyz',
          //   sql: 'SELECT sql FROM sqlite_master WHERE type = \'table\' AND tbl_name = \'rv_user_info\''
          // }, function(ret, err) {
          //   if (ret.status) {
          //       alert(JSON.stringify(ret));
          //   } else {
          //       alert(JSON.stringify(err));
          //   }
          // });
          // db.selectSql({
          //   name: 'dyz',
          //   sql: 'SELECT * FROM rv_groups_xiaoxi'
          // }, function(ret, err) {
          //   if (ret.status) {
          //       alert(JSON.stringify(ret));
          //   } else {
          //       alert(JSON.stringify(err));
          //   }
          // });
          db.executeSql({//创建群聊信息表
              name: 'dyz',
              sql: 'CREATE TABLE IF NOT EXISTS rv_groups_xiaoxi(id INTEGER PRIMARY KEY AUTOINCREMENT, from_uid INT NOT NULL, togid INT NOT NULL, content varchar(255) NOT NULL, content_type INT DEFAULT 0,content_s_img varchar(255) NOT NULL,status INT NOT NULL,addtime TEXT NOT NULL,at_user_ids varchar(255),time_length varchar(255),send_length varchar(255),name varchar(255) NOT NULL,head_img varchar(255) NOT NULL,xid INT NOT NULL)'
          }, function(ret, err) {
              if (ret.status) {//创建群聊信息表成功
                api.setPrefs({key: 'is_database',value: true});//将数据是否创建成功判定为true
              }
          });
      }
  });
}
/*
*写入数据库数据
*/
function insert_data(data_obj){
  var sql="";
  switch (data_obj.lx) {
    case 0://普通文本
        sql='INSERT INTO rv_groups_xiaoxi(id,from_uid,togid,content,content_type,content_s_img,status,addtime,at_user_ids,time_length,send_length,name,head_img,xid)VALUES ('+
            'NULL,'+data_obj.from_id+','+data_obj.gid+', \''+data_obj.nr+'\','+data_obj.lx+',"",1,\''+data_obj.time+'\',\''+data_obj.at_user_ids+'\',"","","'+data_obj.send_name+'","'+data_obj.head_img+'",'+data_obj.xid+')';
      break;
    case 1://图片信息
        sql='INSERT INTO rv_groups_xiaoxi(id,from_uid,togid,content,content_type,content_s_img,status,addtime,at_user_ids,time_length,send_length,name,head_img,xid)VALUES ('+
            'NULL,'+data_obj.from_id+','+data_obj.gid+', \''+data_obj.nr+'\','+data_obj.lx+',"'+data_obj.nr+'",1,\''+data_obj.time+'\',"","","","'+data_obj.send_name+'","'+data_obj.head_img+'",0)';
      break;
    case 2://语音信息
        sql='INSERT INTO rv_groups_xiaoxi(id,from_uid,togid,content,content_type,content_s_img,status,addtime,at_user_ids,time_length,send_length,name,head_img,xid)VALUES ('+
            'NULL,'+data_obj.from_id+','+data_obj.gid+', \''+data_obj.nr+'\','+data_obj.lx+',"",1,\''+data_obj.time+'\',"","'+data_obj.time_length+'","'+data_obj.send_length+'","'+data_obj.send_name+'","'+data_obj.head_img+'",'+data_obj.xid+')';
      break;
  }

  var db = api.require('db');//引入数据库模块
  db.executeSql({
      name: 'dyz',
      sql: sql
  }, function(ret, err) {
      //alert(JSON.stringify(err));
      if (ret.status) {//如果插入则添加用户信息表
          //alert(JSON.stringify(ret));
          api.setPrefs({key: 'is_database',value: true});//将数据是否创建成功判定为true
      } else {
          api.setPrefs({key: 'is_database',value: false});//将数据是否创建成功判定为false
      }
  });
}
/*
*删除数据事件
*prarm #data_obj;数据对象,#table_name;表名
*/
function delete_data(data_obj,table_name){
  var db = api.require('db');//引入数据库模块
  var result=true;
  db.executeSql({
      name: 'dyz',
      sql: 'DELETE FROM '+table_name+' WHERE xid ='+data_obj.xid
  }, function(ret, err) {
      if (ret.status) {
          result=true;
      } else {
          result=false;
      }
  });
  return result;
}
/*
*删除表事件
*/
function delete_table(table_name){
  var db = api.require('db');//引入数据库模块
  var result=true;
  db.executeSql({
      name: 'dyz',
      sql: 'DROP TABLE '+table_name
  }, function(ret, err) {
      if (ret.status) {
          result=true;
      } else {
          result=false;
      }
  });
  return result;
}
