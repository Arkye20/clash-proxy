# parser-script.js
在Clash内引用该js文件即可对订阅文件进行处理，不同的订阅链接**可能需要**根据需求修改正则匹配模板和创建代理组。
```js
parsers:
  // 这里使用正则设置匹配的订阅链接,也可以直接使用url
  - reg: ^.*#parser$
  // JS文件的路径
    file: 'D:\Study\Projects\clash-proxy\parser-script.js'
```

# json
- proxyGroups.json 用来预定义一些代理组
- ruleProviders.json 用来列举出保存的规则txt文件
- rules.json 对规则和代理组进行映射

# rules
存放txt规则文件