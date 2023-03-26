import requests
from bs4 import BeautifulSoup
import time

# 微信群机器人webhook
webhook_url = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=fecf12af-c867-40e7-8565-8df24ecc4eaa"

# 要捕捉的关键词
keywords = ["chatgpt"]

# 定时推送的时间间隔，单位为秒
interval = 10 * 60

# 每次推送的最大文章数
max_articles_per_push = 10

# 储存文章链接、时间和标题的文件路径
filename = "wenzhang.txt"

while True:
    try:
        # 获取Google搜索引擎新闻中的文章链接和标题
        articles_google = []
        url_google = "https://news.google.com/search?q=" + "+".join(keywords) + "&hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans"
        response_google = requests.get(url_google)
        soup_google = BeautifulSoup(response_google.content, "lxml")
        for article in soup_google.find_all("article"):
            link = article.find("a").get("href")
            title = article.find("h3").get_text()
            time_str = article.find("time").get("datetime")
            timestamp = int(time.mktime(time.strptime(time_str, "%Y-%m-%dT%H:%M:%SZ")))
            articles_google.append((link, timestamp, title))

        # 获取百度搜索引擎新闻中的文章链接和标题
        articles_baidu = []
        url_baidu = "https://www.baidu.com/s?rtt=1&bsst=1&cl=2&tn=news&word=" + "+".join(keywords)
        response_baidu = requests.get(url_baidu)
        soup_baidu = BeautifulSoup(response_baidu.content, "lxml")
        for result in soup_baidu.find_all("div", class_="result"):
            link = result.find("a").get("href")
            title = result.find("a").get_text()
            time_str = result.find("p", class_="c-author").find_all("span")[-1].get_text()
            timestamp = int(time.mktime(time.strptime(time_str, "%Y年%m月%d日 %H:%M")))
            articles_baidu.append((link, timestamp, title))

        # 合并文章列表
        articles = articles_google + articles_baidu

        # 推送文章链接和标题到微信群机器人
        # 读取已经推送过的文章链接
        try:
            with open(filename, "r") as f:
                pushed_links = [line.strip().split("\t")[0] for line in f.readlines()]
        except FileNotFoundError:
            pushed_links = []

        # 过滤已经推送过的文章和重复的文章
        articles_to_push = []
        for article in articles:
            link, timestamp, title = article
            if link not in pushed_links and link not in [a[0] for a in articles_to_push]:
                articles_to_push.append(article)

                # 如果没有需要推送的文章，则继续等待
        if not articles_to_push:
            time.sleep(interval)
            continue

        # 发送推送消息
        message = ""
        for i, article in enumerate(articles_to_push):
            if i >= max_articles_per_push:
                break
            link, timestamp, title = article
            message += f"{i+1}. [{title}]({link})\n\n"

        payload = {
            "msgtype": "markdown",
            "markdown": {
                "content": message
            }
        }
        response = requests.post(webhook_url, json=payload)
        response.raise_for_status()

        # 将推送过的文章链接写入文件
        with open(filename, "a") as f:
            for article in articles_to_push:
                link, timestamp, title = article
                f.write(f"{link}\t{timestamp}\t{title}\n")

        # 等待一段时间再进行下一次推送
        time.sleep(interval)
