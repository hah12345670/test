##!/usr/bin/env python3
# -*- coding: utf-8 -*-

' 采集算法 '

__author__ = 'H-xm'

import requests
import parsel
import re
import random, json, time
# from pyecharts import options as opts
# from pyecharts.charts import Bar, Line
import os # 解决有（开启）代理无法采集数据问题
os.environ['NO_PROXY'] = 'stackoverflow.com'
from pprint import pprint

# timeStart = time.time()  # 开始计时

class ReqTols(object):
	
	def __init__(self):
		pass

	# 采集节点数据
	def get_data(self, url):
		cookies = {
				'_ga_WSDMNLE90Z': 'GS1.1.1660929026.1.1.1660929082.0.0.0',
				'_ga': 'GA1.1.754542148.1660929027',
				'__gads': 'ID=6c32d94dcb4dac2b-22f3e1d6b0d500a7:T=1660929031:RT=1660929031:S=ALNI_MZbqcEX3hAZkGwgVdgrek3SnUIHTQ',
				'__gpi': 'UID=000008cabce303ed:T=1660929031:RT=1660929031:S=ALNI_MYfdgrXcRLA437E5miToh0TO1FFRQ',
		}
		headers = {
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
				'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
				'Connection': 'keep-alive',
				'Upgrade-Insecure-Requests': '1',
				'Sec-Fetch-Dest': 'document',
				'Sec-Fetch-Mode': 'navigate',
				'Sec-Fetch-Site': 'cross-site',
				'If-Modified-Since': '', # 解决 response[304]
				'If-None-Match': '', # 解决 response[304]
		}
		requests.adapters.DEFAULT_RETRIES = 5
		response = requests.get(url, cookies=cookies, headers=headers)
		# response.encoding = 'gb2312' # 不乱码
		# html_data = response.text
		return response

	# 采集1
	def get_data_1(self, url, title = 'body'):
		response = self.get_data(url)
		response.encoding = 'gb2312' # 不乱码
		html_data = response.text
		select = parsel.Selector(html_data)
		body = select.css(title).get() # 获取body内容
		res = body.replace('baidu.com', '1.com') # 替换 百度的脚本
		# print(res)
		return res
	
	# 采集2
	def get_data_2(self, url, title = 'body'):
		response = self.get_data(url)
		response.encoding = 'utf-8' # 不乱码
		html_data = response.text
		select = parsel.Selector(html_data)
		body = select.css(title).get() # 获取body内容
		res = body.replace('baidu.com', '1.com') # 替换 百度的脚本
		# print(res)
		return res

	# 生成html
	def html(self, urls, str1, str2):
		new_html = './github-main-htm/he6.html'
		f = open(new_html, 'w', encoding="utf-8")
		# str1 = ''
		# str2 = ''
		message = """<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>有2个网址</title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<meta content="" name="keywords">
	<meta content="" name="description">
	<!-- <link href="./favicon.ico" rel="icon"> -->
</head>
<hr>
<h1>%s</h1>
<!-- 总网站 http://dfw1.dingfuluntan.com/ -->
<!-- 总网站 http://312011.com -->
<hr>
%s
<hr>
<h1>%s</h1>
<!-- 总网站 http://141516.com/ -->
<hr>
%s
"""%(urls[0],str1,urls[1],str2)
		f.write(message)
		f.close()

if __name__ == '__main__':
	obj = ReqTols()
	# 爬虫的异常处理
	is_flag = True
	while is_flag:
		try:
			urls = [
							'http://dfw2.dingfuluntan.com/#667233',
							# 'http://www-222739.com/141516.html#3', # 和下面是一样的
							'https://www-563344.com/#222739/141516.html#1',
							]
			str1 = obj.get_data_1(urls[0], 'body')
			str2 = obj.get_data_2(urls[1], 'body')
			obj.html(urls, str1, str2) # 生成html
			is_flag = False
		except:
			print("Connection refused by the server..")
			continue
