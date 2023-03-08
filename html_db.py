##!/usr/bin/env python3
# -*- coding: utf-8 -*-

' 数据库操作 '

__author__ = 'H-xm'

import sqlite3
import os
import time
from pprint import pprint

timeStart = time.time()  # 开始计时

class DbSqlite3(object):

	PATH_DB = ''

	def __init__(self, path_db = os.path.dirname(__file__) + '/test.db'):
		self.PATH_DB = path_db

	# 数据库连接
	def db_cursor(self):
		self.db = sqlite3.connect(self.PATH_DB)
		# 创建游标对象(1.执行sql语句 2.处理数据查询结果)
		self.cursor = self.db.cursor()

	# 提交 (查询数据库不使用)
	def db_commit(self):
		self.db.commit()

	# 关闭
	def db_cursor_close(self):
		self.cursor.close()
		self.db.close()

	# 创建数据库
	def create_db(self, sql):
		self.db_cursor()
		# 创建表格
		# self.cursor.execute('''CREATE TABLE category
		# 									(id int primary key, sort int, name varchar)''')
		# 执行sql
		# self.cursor.execute('''CREATE TABLE book
		# 									(id int primary key,
		# 									sort int,
		# 									name varchar,
		# 									price real,
		# 									category int,
		# 									FOREIGN KEY (category) REFERENCES category(id))''')
		self.cursor.execute(sql)
		# 提交 (查询数据库不使用)
		self.db_commit()
		# 关闭
		self.db_cursor_close()

	# 插入数据
	def db_insert(self, sql, arr=[], types=1):
		self.db_cursor()
		# books = [
		# 					(1, 1, 'Cook Recipe', 3.12, 1),
		# 					(2, 3, 'Python Intro', 17.5, 2),
		# 					(3, 2, 'OS Intro', 13.6, 2),
		# 				]
		# 执行添加sql语句
		# cursor.execute("INSERT INTO category VALUES (1, 1, 'kitchen')")
		# 使用占位符添加一条记录
		# cursor.execute("INSERT INTO category VALUES (?,?,?)", [2, 2, 'computer'])
		# 执行添加多个数据
		# cursor.executemany('INSERT INTO book VALUES (?, ?, ?, ?, ?)', arr)
		if types==1: # 执行添加sql语句
			self.cursor.execute(sql)
		elif types==2: # 使用占位符添加一条记录
			self.cursor.execute(sql, arr) # arr是数组
		elif types==3: # 执行添加多个数据
			self.cursor.executemany(sql, arr) # arr是元组
		self.db_commit()
		self.db_cursor_close()

	# 修改数据
	def db_update(self, sql, tuple):
		self.db_cursor()
		# 执行添加sql语句
		# cursor.execute('UPDATE book SET price=? WHERE id=?',(1000, 1))
		self.cursor.execute(sql, tuple) # tuple是元组
		self.db_commit()
		self.db_cursor_close()

	# 删除数据
	def db_delete(self, sql):
		self.db_cursor()
		# 执行添加sql语句
		# cursor.execute("DELETE FROM category WHERE id in(4)")
		self.cursor.execute(sql)
		self.db_commit()
		self.db_cursor_close()

	# 查询数据
	def db_select(self, sql):
		self.db_cursor()
		# 执行添加sql语句
		# cursor.execute("SELECT * FROM book")
		# data = cursor.fetchall() # 获取一行数
		self.cursor.execute(sql)
		data = self.cursor.fetchall() # 获取所有
		self.db_cursor_close()
		return data

	# 删除表格
	def db_delall(self, tablename):
		self.db_cursor()
		# 执行添加sql语句
		# cursor.execute('DROP TABLE category')
		self.cursor.execute('DROP TABLE '+tablename)
		self.db_commit()
		self.db_cursor_close()

if __name__ == '__main__':
	obj = DbSqlite3()
	''' 创建表格 '''
	# sql1 = 'CREATE TABLE category(id int primary key, sort int, name varchar)'
	# sql2 = '''CREATE TABLE book
	# 													(id int primary key,
	# 													sort int,
	# 													name varchar,
	# 													price real,
	# 													category int,
	# 													FOREIGN KEY (category) REFERENCES category(id))'''
	# obj.create_db(sql1)
	# obj.create_db(sql2)
	''' 添加数据 '''
	# sql = "INSERT INTO category VALUES (1, 1, 'kitchen')"
	# obj.db_insert(sql)
	# sql = "INSERT INTO category VALUES (?,?,?)"
	# arr = [4, 2, 'computer']
	# obj.db_insert(sql, arr, 2)
	# sql = 'INSERT INTO book VALUES (?, ?, ?, ?, ?)'
	# arr = [
	# 				(1, 1, 'Cook Recipe', 3.12, 1),
	# 				(2, 3, 'Python Intro', 17.5, 2),
	# 				(3, 2, 'OS Intro', 13.6, 2),
	# 			]
	# obj.db_insert(sql, arr, 3)
	''' 修改数据 '''
	# sql = 'UPDATE book SET price=? WHERE id=?'
	# tuples = (1000, 1)
	# obj.db_update(sql, tuples)
	''' 删除数据 '''
	# sql = "DELETE FROM category WHERE id in(4)"
	# obj.db_delete(sql)
	''' 清空表数据 '''
	# obj.db_delall('book')
	''' 查询表数据 '''
	sql = "SELECT * FROM book"
	arr = obj.db_select(sql)
	pprint(arr)

	print('================================')
	timeEnd = time.time()
	print('代码执行时间：', str(round(timeEnd - timeStart, 7)) + ' s')
	print('================================')
