module.exports.parse = async (raw, { yaml }) => {
    // 将原始订阅链接文件内的代理解析出来并且分成特定代理组
    const profile = yaml.parse(raw);
    const proxies = profile.proxies;
    const proxyNames = proxies.map((proxy) => proxy.name);
    // 香港普通线路代理组
    const HKDirectRegex = /HK \d{3}/
    const HKDirectNames = proxyNames.filter(item => HKDirectRegex.test(item))
    // 香港中继NF代理组
    const HKRelayNFRegex = /^香港.*NF$/
    const HKRelayNFNames = proxyNames.filter(item => HKRelayNFRegex.test(item))
    // 香港中继动态代理组
    const HKRelayDynRegex = /香港.+中继\s动态/
    const HKRelayDynNames = proxyNames.filter(item => HKRelayDynRegex.test(item))
    // 香港IPLC代理组
    const HKIPLCRegex = /IPLC.*香港/
    const HKIPLCNames = proxyNames.filter(item => HKIPLCRegex.test(item))
    // 台湾代理组
    const TWRegex = /台湾|TW/
    const TWNames = proxyNames.filter(item => TWRegex.test(item))
    // 新加坡代理组
    const SGRegex = /狮城|新加坡|SG/
    const SGNames = proxyNames.filter(item => SGRegex.test(item))
    // 日本代理组
    const JPRegex = /日本|JP/
    const JPNames = proxyNames.filter(item => JPRegex.test(item))
    // 美国代理组
    const USRegex = /美国|US/
    const USNames = proxyNames.filter(item => USRegex.test(item))
    // 其他国家代理组
    const OtherRegex = /韩国|英国|俄罗斯|阿根廷|马来|土耳其|RU/
    const OtherNames = proxyNames.filter(item => OtherRegex.test(item))

    // json文件路径
    const proxyGroupsJsonPath = 'D:/Study/Projects/clash-proxy/json/proxyGroups.json';
    const ruleProvidersJsonPath = 'D:/Study/Projects/clash-proxy/json/ruleProviders.json';
    const rulesJsonPath = 'D:/Study/Projects/clash-proxy/json/rules.json';

    // 读取外部json文件预定义代理组，并且与地区代理组结合
    const fs = require('fs');
    const proxyGroups = JSON.parse(
        fs.readFileSync(proxyGroupsJsonPath, 'utf8')
    ).concat([
        {
            name: "Hong Kong",
            type: "select",
            proxies: HKIPLCNames.concat(HKRelayDynNames).concat(HKRelayNFNames).concat(HKDirectNames)
        },
        {
            name: "Taiwan",
            type: "select",
            proxies: TWNames
        },
        {
            name: "Singapore",
            type: "select",
            proxies: SGNames
        },
        {
            name: "Japan",
            type: "select",
            proxies: JPNames
        },
        {
            name: "United States",
            type: "select",
            proxies: USNames
        },
        {
            name: "Other Countries",
            type: "select",
            proxies: OtherNames
        },
        {
            name: "⚖️HK-Direct",
            type: "load-balance",
            url: "http://www.google.com/generate_204",
            interval: 300,
            strategy: "consistent-hashing",
            proxies: HKDirectNames
        },
        {
            name: "⚖️HK-Relay-Dynamic",
            type: "load-balance",
            url: "http://www.google.com/generate_204",
            interval: 300,
            strategy: "consistent-hashing",
            proxies: HKRelayDynNames
        },
        {
            name: "⚖️HK-Relay-NF",
            type: "load-balance",
            url: "http://www.google.com/generate_204",
            interval: 300,
            strategy: "consistent-hashing",
            proxies: HKRelayNFNames
        },
        {
            name: "⚖️HK-IPLC",
            type: "load-balance",
            url: "http://www.google.com/generate_204",
            interval: 300,
            strategy: "consistent-hashing",
            proxies: HKIPLCNames
        },
    ])


    // domain是域名类规则，ipcidr是地质类规则，classical是应用程序类规则
    const ruleProviders = JSON.parse(
        fs.readFileSync(ruleProvidersJsonPath, 'utf8')
    );

    const rules = JSON.parse(
        fs.readFileSync(rulesJsonPath, 'utf8')
    );
    return yaml.stringify({
        ...profile,
        "proxy-groups": proxyGroups,
        "rule-providers": ruleProviders,
        rules,
    });
};