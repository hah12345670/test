import requests
import parsel
import re
import os

# 采集节点数据
def get_data(url):
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

# 正则匹配网页中指定的链接
def re_get_url_3(self, url, title, name = 'test', arr_pr = [], encode = "utf-8"):
	try:
		str1 = self.get_data_3(url, 'html')
	except ValueError as e:
		print('错误信息:{} -> 无法访问'.format(url))
	selector = parsel.Selector(str1)
	arr = selector.css('.white-box').getall()
	new_html = os.path.dirname(__file__) + '\{}.html'.format(name)
	str1 = ''
	for item in arr_pr:
		str1 += '<hr><h1>{}</h1><hr>{}'.format(item[0],arr[item[1]])
	f = open(new_html, 'w', encoding=encode)
	message = """<!DOCTYPE html>
<hr>
<h1>%s</h1>
<hr>
%s
"""%(title,str1)
	f.write(message)
	f.close()

url = 'https://www.636989.com/?mc=true'
res = get_data(url)
# res.encoding = 'gb2312' # 不乱码
html_data = res.text
selector = parsel.Selector(html_data)
arr = selector.css('.white-box').getall()
new_html = os.path.dirname(__file__) + '\{}.html'.format('test')
# selector = parsel.Selector(arr[44])
# arr = selector.css('.white-box table').getall()
# res1 = re.findall(r'<div class="cgi-gsb grey-line">\n(.+?)每期结束', arr[44], re.S)
str1 = arr[44]
f = open(new_html, 'w', encoding="utf-8")
message = """<!DOCTYPE html>
<hr>
<h1>%s</h1>
<hr>
%s
"""%(url,str1)
f.write(message)
f.close()