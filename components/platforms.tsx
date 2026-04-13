"use client"

const platforms = [
  { name: "小红书", category: "社交" },
  { name: "抖音", category: "视频" },
  { name: "微信公众号", category: "社交" },
  { name: "微博", category: "社交" },
  { name: "B站", category: "视频" },
  { name: "快手", category: "视频" },
  { name: "知乎", category: "问答" },
  { name: "今日头条", category: "资讯" },
  { name: "百家号", category: "资讯" },
  { name: "企鹅号", category: "资讯" },
  { name: "大鱼号", category: "资讯" },
  { name: "搜狐号", category: "资讯" },
  { name: "网易号", category: "资讯" },
  { name: "一点号", category: "资讯" },
  { name: "趣头条", category: "资讯" },
  { name: "简书", category: "写作" },
  { name: "CSDN", category: "技术" },
  { name: "掘金", category: "技术" },
  { name: "思否", category: "技术" },
  { name: "博客园", category: "技术" },
  { name: "豆瓣", category: "社区" },
  { name: "淘宝", category: "电商" },
  { name: "京东", category: "电商" },
  { name: "拼多多", category: "电商" },
  { name: "得物", category: "电商" },
  { name: "闲鱼", category: "电商" },
  { name: "天猫", category: "电商" },
  { name: "美团", category: "生活" },
  { name: "大众点评", category: "生活" },
  { name: "携程", category: "旅行" },
  { name: "马蜂窝", category: "旅行" },
  { name: "飞猪", category: "旅行" },
  { name: "小宇宙", category: "播客" },
  { name: "喜马拉雅", category: "音频" },
  { name: "网易云音乐", category: "音乐" },
  { name: "QQ音乐", category: "音乐" },
  { name: "微视", category: "视频" },
  { name: "视频号", category: "视频" },
  { name: "好看视频", category: "视频" },
  { name: "西瓜视频", category: "视频" },
  { name: "皮皮虾", category: "社区" },
  { name: "最右", category: "社区" },
]

const categories = ["全部", "社交", "视频", "资讯", "电商", "技术", "生活", "其他"]

export function Platforms() {
  return (
    <section id="platforms" className="bg-[#0A0A0F] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[#C9A84C]">
            <span className="text-lg">{"〉"}</span>
            <span className="text-sm font-medium tracking-wider uppercase">平台支持</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[#EEF2EA] md:text-4xl text-balance">
            覆盖 <span className="text-[#C9A84C]">42</span> 个主流平台
          </h2>
          <p className="mx-auto max-w-2xl text-[#9BA89F]">
            一次创作，全网分发。自动适配各平台内容规范和风格特性
          </p>
        </div>

        {/* Platform Grid */}
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((platform, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-lg border border-[#2A2A36] bg-[#12121A] px-4 py-2 transition-all hover:border-[#C9A84C]/50 hover:bg-[#1A1A24]"
              >
                <span className="text-sm text-[#EEF2EA] group-hover:text-[#C9A84C]">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "42", label: "支持平台" },
              { value: "99.9%", label: "发布成功率" },
              { value: "< 5s", label: "适配时间" },
              { value: "实时", label: "数据同步" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#2A2A36] bg-[#12121A] p-6 text-center"
              >
                <div className="mb-1 text-2xl font-bold text-[#C9A84C] md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-sm text-[#9BA89F]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
