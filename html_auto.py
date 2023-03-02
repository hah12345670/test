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
# os.environ['NO_PROXY'] = 'stackoverflow.com'
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
	
	# 采集3
	def get_data_3(self, url, title = 'body'):
		response = self.get_data(url)
		response.encoding = 'utf-8' # 不乱码
		html_data = response.text
		select = parsel.Selector(html_data)
		body = select.css(title).get() # 获取body内容
		res = body.replace('baidu.com', '1.com') # 替换 百度的脚本
		res = res.replace('swiper-container', '')
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

	# 爬虫的异常处理 1
	def req_try_1(self):
		# 爬虫的异常处理
		is_flag = True
		while is_flag:
			try:
				urls = [
								'http://dfw2.dingfuluntan.com/#667233',
								'http://www-222739.com/141516.html#2',
								]
				str1 = self.get_data_1(urls[0], 'body')
				str2 = self.get_data_2(urls[1], 'body')
				self.html(urls, str1, str2) # 生成html
				is_flag = False
			except:
				print("Connection refused by the server..")
				continue

	# 生成html
	def html_1(self):
		new_html = os.path.dirname(__file__) + '\he6.html'
		# new_html = './github-main-htm/he6.html'
		f = open(new_html, 'w', encoding="utf-8")
		# str1 = ''
		# str2 = ''
		message = """<!DOCTYPE html>
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>推荐网址</title>
<link rel="stylesheet" href="he_js_css_img/main.css">
</head>
<body>
<div class="body_view">
<div class="header_title clearfix">
<a class="logo fl" href="" target="view_window" style="user-select: none">推荐网址</a>
<div class="title_tips fr">温馨提示：尊敬的用户，如发现备用线路无法正常访问时，请更换其他浏览器（推荐浏览器：谷歌、火狐）进行访问！</div>
</div>
<div class="title_tips_text m_show">请使用下方推荐的浏览器访问</div>
<div class="xianlu">
<div class="clearfix">
<!-- 总网站 http://dfw1.dingfuluntan.com/ -->
<!-- 总网站 http://312011.com -->
<a class="xianlu_item ml" href="he_1.html">
<div class="text">dfw1.dingfuluntan</div>
<div class="icon m_show"></div>
</a>
<!-- 总网站 http://141516.com/ -->
<a class="xianlu_item" href="he_2.html">
<div class="text">www-222739</div>
<div class="icon m_show"></div>
</a>
<!-- 总网站 http://2168.site/ -->
<a class="xianlu_item" href="he_3.html">
<div class="text">2168_site</div>
<div class="icon m_show"></div>
</a>
<!-- 总网站 https://868575.com/ -->
<a class="xianlu_item" href="he_4.html">
<div class="text">管家婆</div>
<div class="icon m_show"></div>
</a>
<!-- 总网站 https://255727.com/ -->
<a class="xianlu_item mr" href="he_5.html" target="_blank">
<div class="text">棋琴书画</div>
<div class="icon m_show"></div>
</a>
<!-- 总网站 https://255727.com/ -->
<a class="xianlu_item" href="he_6.html" target="_blank">
<div class="text">无错十肖</div>
<div class="icon m_show"></div>
</a>
<!-- 总网站 https://48k1.us/ -->
<a class="xianlu_item" href="he_7.html" target="_blank">
<div class="text">澳门老人味</div>
<div class="icon m_show"></div>
</a>
<!-- 总网站 https://48k1.us/ -->
<a class="xianlu_item mr" href="he_8.html" target="_blank">
<div class="text">无错三十六码</div>
<div class="icon m_show"></div>
</a>
<!-- 总网站 https://48k1.us
<a class="xianlu_item mr" href="he_5.html">
<div class="text">kj_48kk_homes</div>
<div class="icon m_show"></div>
</a> -->
</div>
</div>
<!-- <div class="commonlyUsed_title clearfix m_show">
<div class="used_title_item select">荐浏览器</div>
<div class="used_title_item">常用网址</div>
<div class="used_title_item">常用购物</div>
<div class="used_title_item" style="border: none;">常用资讯</div>
</div>
<div class="commonlyUsed clearfix">
<div class="used_left fl">
<div class="left_item used_item m_showUsed">
<div class="left_title used_item_title">荐浏览器</div>
<div class="left_body clearfix">
<a target="blank" href="https://www.ub66.com/" class="address_item">
<img src="he_js_css_img/HY.png">
<span>寰宇浏览器</span>
</a>
<a target="blank" href="https://www.google.cn/intl/zh-CN/chrome/" class="address_item">
<img src="he_js_css_img/gg.png">
<span>谷歌浏览器</span>
</a>
<a target="blank" href="https://www.opera.com/zh-cn" class="address_item">
<img src="he_js_css_img/op.png">
<span>op浏览器</span>
</a>
<a target="blank" href="http://m.liebao.cn/" class="address_item">
<img src="he_js_css_img/4.png">
<span>猎豹浏览器</span>
</a>
<a target="blank" href="https://www.firefox.com.cn/download/" class="address_item">
<img src="he_js_css_img/lb.png">
<span>火狐浏览器</span>
</a>
<a target="blank" href="https://www.myquark.cn/" class="address_item">
<img src="he_js_css_img/kk.png">
<span>夸克浏览器</span>
</a>
</div>
</div>
<div class="left_item used_item m_none">
<div class="left_title used_item_title">常用网址</div>
<div class="left_body clearfix">
<a target="blank" href="https://www.baidu.com/" class="address_item">
<img src="he_js_css_img/1.png">
<span>百度</span>
</a>
<a target="blank" href="https://www.qq.com/" class="address_item">
<img src="he_js_css_img/2.png">
<span>腾讯</span>
</a>
<a target="blank" href="https://www.ifeng.com/" class="address_item">
<img src="he_js_css_img/3.png">
<span>凤凰网</span>
</a>
<a target="blank" href="https://www.sohu.com/" class="address_item">
<img src="he_js_css_img/4.png">
<span>搜狐</span>
</a>
<a target="blank" href="https://www.163.com/" class="address_item">
<img src="he_js_css_img/5.png">
<span>网易</span>
</a>
<a target="blank" href="https://www.youku.com/" class="address_item">
<img src="he_js_css_img/6.png">
<span>优酷</span>
</a>
<a target="blank" href="https://www.jd.com/" class="address_item">
<img src="he_js_css_img/7.png">
<span>京东商场</span>
</a>
<a target="blank" href="https://www.12306.cn/" class="address_item">
<img src="he_js_css_img/8.png">
<span>12306</span>
</a>
<a target="blank" href="https://gz.58.com/" class="address_item">
<img src="he_js_css_img/9.png">
<span>58同城</span>
</a>
<a target="blank" href="https://www.ctrip.com/" class="address_item">
<img src="he_js_css_img/10.png">
<span>携程网</span>
</a>
</div>
</div>
<div class="left_item used_item m_none">
<div class="left_title used_item_title">常用购物</div>
<div class="left_body clearfix">
<a target="blank" href="https://www.taobao.com/" class="address_item">
<img src="he_js_css_img/21.png">
<span>淘宝</span>
</a>
<a target="blank" href="https://www.jd.com/" class="address_item">
<img src="he_js_css_img/22.png">
<span>京东商城</span>
</a>
<a target="blank" href="https://www.tmall.com/" class="address_item">
<img src="he_js_css_img/23.png">
<span>天猫精选</span>
</a>
<a target="blank" href="https://www.suning.com/" class="address_item">
<img src="he_js_css_img/24.png">
<span>苏宁易购</span>
</a>
<a target="blank" href="https://www.gome.com.cn/" class="address_item">
<img src="he_js_css_img/25.png">
<span>国美在线</span>
</a>
<a target="blank" href="http://book.dangdang.com/" class="address_item">
<img src="he_js_css_img/26.png">
<span>当当</span>
</a>
<a target="blank" href="https://ju.taobao.com/" class="address_item">
<img src="he_js_css_img/27.png">
<span>聚划算</span>
</a>
<a target="blank" href="http://www.meilishuo.com/" class="address_item">
<img src="he_js_css_img/28.png">
<span>美丽说</span>
</a>
<a target="blank" href="https://www.mogu.com/" class="address_item">
<img src="he_js_css_img/29.png">
<span>蘑菇街</span>
</a>
<a target="blank" href="https://www.vip.com/" class="address_item">
<img src="he_js_css_img/30.png">
<span>唯品会</span>
</a>
</div>
</div>
</div>
<div class="used_right fr">
<div class="right_item used_item m_none">
<div class="right_title used_item_title">常用资讯</div>
<div class="right_body clearfix">
<a target="blank" href="https://news.sina.com.cn/" class="address_item">
<img src="he_js_css_img/31.png">
<span>新浪新闻</span>
</a>
<a target="blank" href="https://news.ifeng.com/" class="address_item">
<img src="he_js_css_img/32.png">
<span>凤凰资讯</span>
</a>
<a target="blank" href="http://www.uzaobao.com/" class="address_item">
<img src="he_js_css_img/33.png">
<span>联合早报</span>
</a>
<a target="blank" href="http://www.people.com.cn/" class="address_item">
<img src="he_js_css_img/34.png">
<span>人民网</span>
</a>
<a target="blank" href="https://news.qq.com/" class="address_item">
<img src="he_js_css_img/35.png">
<span>腾讯新闻</span>
</a>
<a target="blank" href="https://news.sohu.com/" class="address_item">
<img src="he_js_css_img/36.png">
<span>搜狐新闻</span>
</a>
<a target="blank" href="https://www.huanqiu.com/" class="address_item">
<img src="he_js_css_img/37.png">
<span>环球时报</span>
</a>
<a target="blank" href="https://news.163.com/" class="address_item">
<img src="he_js_css_img/38.png">
<span>网易新闻</span>
</a>
<a target="blank" href="http://www.xinhuanet.com/" class="address_item">
<img src="he_js_css_img/39.png">
<span>新华网</span>
</a>
<a target="blank" href="https://news.baidu.com/" class="address_item">
<img src="he_js_css_img/40.png">
<span>百度新闻</span>
</a>
</div>
</div>
</div> -->
</div>
</div>

<div style="display:none;">
<script src="he_js_css_img/hm.js"></script><script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.123.com/hm.js?1897ad017fa0eb9e1dcd420ea26be748";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
</div>
<script src="he_js_css_img/jquery-3.6.0.min.js"></script>
<script>
			$('.used_title_item').click(function() {
				var index = $(this).index()
				$('.used_title_item').removeClass('select')
				$(this).addClass('select')
				$('.used_item').removeClass('m_showUsed').addClass('m_none').eq(index).removeClass('m_none').addClass(
					'm_showUsed')
			})
		</script>
</body></html>
"""
		f.write(message)
		f.close()

	# 生成html 一个独立的小页面 body下的内容
	def html_2(self, name, url, str1):
		new_html = os.path.dirname(__file__) + '\{}.html'.format(name)
		# new_html = './github-main-htm/{}.html'.format(name)
		f = open(new_html, 'w', encoding="utf-8")
		# str1 = ''
		# str2 = ''
		message = """<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title></title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<meta content="" name="keywords">
	<meta content="" name="description">
	<!-- <link href="./favicon.ico" rel="icon"> -->
</head>
<hr>
<h1>%s</h1>
<hr>
%s
"""%(url,str1)
		f.write(message)
		f.close()

	# 生成html 一个独立的小页面 整个html的内容
	def html_3(self, name, url, str1):
		new_html = os.path.dirname(__file__) + '\{}.html'.format(name)
		# new_html = './github-main-htm/{}.html'.format(name)
		f = open(new_html, 'w', encoding="utf-8")
		# str1 = ''
		# str2 = ''
		message = """<!DOCTYPE html>
<hr>
<h1>%s</h1>
<hr>
%s
"""%(url,str1)
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
							'http://www-222739.com/141516.html#2',
							'https://mm.2168.site/',
							'https://aa.7278834.com:1888/', # 管家婆
							'https://bxzwz.com/hao.aspx?id=44', # 255727的棋琴书画
							'https://bxzwz.com/tt.aspx?id=0008', # 255727的无错十肖
							'https://33.48kk99.com/Images/info/id/14', # 48k的澳门老人味
							'https://33.48kk99.com/Images/info/id/1874', # 48k的无错三十六码
							'https://kj.48kk.homes:1888/', # 48.48kk.homes:1888
							]
			str1 = obj.get_data_1(urls[0], 'body')
			# print('he_1')
			str2 = obj.get_data_2(urls[1], 'body')
			# print('he_2')
			str3 = obj.get_data_2(urls[2], 'body')
			# print('he_3')
			# str4 = obj.get_data_2(urls[3], 'body')
			# print('he_4')
			str5 = obj.get_data_2(urls[4], 'body')
			# print('he_5')
			str6 = obj.get_data_2(urls[5], 'body')
			# print('he_6')
			str7 = obj.get_data_3(urls[6], 'html')
			# print('he_7')
			str8 = obj.get_data_3(urls[7], 'html')
			# print('he_8')
			obj.html_2('he_1', urls[0], str1)
			obj.html_2('he_2', urls[1], str2)
			obj.html_2('he_3', urls[2], str3)
			# obj.html_2('he_4', urls[3], str4)
			obj.html_2('he_5', urls[4], str5)
			obj.html_2('he_6', urls[5], str6)
			obj.html_3('he_7', urls[6], str7)
			obj.html_3('he_8', urls[7], str8)
			obj.html_1() # 生成html
			is_flag = False
		except:
			print("Connection refused by the server..")
			continue
