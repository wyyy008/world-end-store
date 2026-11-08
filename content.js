window.GAME_CONTENT = {
  shiftLength: 6,
  startingCash: 30,
  startingTickets: 0,
  startingStock: {
    umbrella: 2,
    coffee: 3,
    lunchbox: 1
  },
  prologue: {
    title: "序章 · 雨还没有停",
    steps: [
      {
        scene: "rain",
        sceneLabel: "雾港公交站 · 尚未营业",
        speaker: "旁白",
        text: "你在雨声里醒来。柜台比你的记忆更早认识你。"
      },
      {
        scene: "counter",
        sceneLabel: "便利店 · 柜台后",
        speaker: "旁白",
        text: "你不记得自己的名字，也不记得为什么会站在这里。只有门上的六盏灯还亮着，像在等你做第一个决定。"
      },
      {
        scene: "rain",
        sceneLabel: "雾港公交站 · 尚未营业",
        speaker: "旁白",
        text: "门外的雨没有变大，也没有停。玻璃上的水痕把站牌切成一截一截，像一张很久以前的时刻表。"
      },
      {
        scene: "counter",
        sceneLabel: "便利店 · 柜台后",
        speaker: "旁白",
        text: "你试着回想昨天。脑中只剩打开灯、拉平收据、把门边的水擦干这些事，像身体比记忆更早知道这家店该怎样活下去。"
      },
      {
        scene: "counter",
        sceneLabel: "便利店 · 柜台后",
        speaker: "旁白",
        text: "你低头，看见柜台下压着一只纸箱。没有寄件人，也没有收件人，只写着：请在第八夜第一班车前，替我找到去处。"
      },
      {
        scene: "counter",
        sceneLabel: "便利店 · 柜台后",
        speaker: "纸箱上的旧邮戳",
        text: "“雾港，末班车，不要拆。”字迹被水泡开，只有这三个词还认得出来。"
      },
      {
        scene: "counter",
        sceneLabel: "便利店 · 柜台后",
        speaker: "你",
        text: "雨还在下。你决定先确认哪一件事？",
        choices: [
          {
            id: "shelf",
            label: "先看看货架",
            detail: "辨认这间店里现在有什么",
            flag: "prologueObservedShelf"
          },
          {
            id: "door",
            label: "先听门外的声音",
            detail: "确认是不是已经有人在等",
            flag: "prologueListenedAtDoor"
          },
          {
            id: "hands",
            label: "先看看自己的手",
            detail: "确认这具身体还记得什么",
            flag: "prologueCheckedHands"
          }
        ]
      },
      {
        scene: "counter",
        sceneLabel: "便利店 · 柜台后",
        speaker: "旁白",
        branch: {
          shelf: "货架上有伞、咖啡和一只保温饭盒。你忽然觉得，它们在这里也许不只是标价签上的数字。",
          door: "门外没有脚步声，只有一个人停在雨里的呼吸。还没有开门，已经有人需要这间店。",
          hands: "掌心沾着纸箱上的灰。你想不起过去，但这双手至少还知道怎样把一盏灯打开。"
        }
      },
      {
        scene: "door",
        sceneLabel: "便利店 · 门边",
        speaker: "旁白",
        text: "雨声里传来三下轻响，像有人用伞尖敲了敲门。你没有立刻回答，门外的呼吸也没有离开。"
      },
      {
        scene: "door",
        sceneLabel: "便利店 · 门边",
        speaker: "门外的声音",
        character: "?",
        text: "“老板，今天营业吗？”"
      },
      {
        scene: "counter",
        sceneLabel: "便利店 · 柜台后",
        speaker: "旧收据",
        text: "你在收银台下摸到一张被雨泡皱的说明。",
        tips: [
          "六盏灯是六次可以行动的时间。补货、小事和接待常客各用一格。",
          "打开商品、对话和记忆册不耗时间。柜台前的客人不会因为你在思考而离开。",
          "打烊时留下一件东西。它会跟着店进入下一夜，也会改变后面的回答。",
          "每夜有一项通行条件。达成后，收银台下的旧票机会在打烊时吐出一张车票。",
          "没有车票也能启程，但店会被动漂移，并损失 ¥5。"
        ]
      },
      {
        scene: "counter",
        sceneLabel: "便利店 · 柜台后",
        speaker: "旁白",
        text: "纸箱里有五页没有寄出的信。每一页都没有收件人，只有一个相同的站名：雾港。第一班车到站前，会有五个人先后走进店里。他们都在等同一班车，也都被这五页信悄悄连在一起。每替一个人做成一件会被记住的事，你就能看见 TA 一段没有说完的过去。"
      },
      {
        scene: "door",
        sceneLabel: "便利店 · 即将营业",
        speaker: "旁白",
        text: "门外的人还在等。你把包裹放回柜台正中，打开门，让第一夜的雨声一起进来。",
        finish: true
      }
    ]
  },
  products: {
    umbrella: {
      name: "透明雨伞",
      cost: 6,
      price: 10,
      origin: "普通世界，第 12 号仓库",
      commonUse: "遮雨，也适合忘记在公交车座位下面。",
      specialUse: "在雾港，伞面会接住别人落下的记忆；阿澄从不把伞带走。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M7 20c1.5-8 6-12 13-12s11.5 4 13 12c-2.4-1.6-4.7-2.4-7-2.4S21.7 18.4 20 20c-1.7-1.6-3.7-2.4-6-2.4S9.4 18.4 7 20Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M20 20v10.5c0 3.4 5 3.4 5-.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    },
    coffee: {
      name: "速溶咖啡",
      cost: 3,
      price: 6,
      origin: "无眠车站，夜班供货箱",
      commonUse: "热水冲开，能让人再撑一班车。",
      specialUse: "沈伯每次买两罐，只喝一罐。剩下那罐总是留给别人。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M10 11h17v15.5c0 4.7-3.8 8.5-8.5 8.5S10 31.2 10 26.5V11Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M27 15h2.5a4 4 0 0 1 0 8H27M14 8h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M14 17h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    },
    lunchbox: {
      name: "保温饭盒",
      cost: 12,
      price: 18,
      origin: "旧夏日，车站失物柜",
      commonUse: "能热一份饭，也能让汤撑到末班车。",
      specialUse: "在雾港，饭盒会替人保存一句没有说完的话。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="7" y="15" width="26" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 15v-3.5A3.5 3.5 0 0 1 15.5 8h9a3.5 3.5 0 0 1 3.5 3.5V15M7 21h26" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M18 26h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    },
    radio: {
      name: "旧收音机",
      cost: 20,
      price: 30,
      origin: "倒着走的夏天，旧货摊",
      commonUse: "旋钮有点松，只能收到一个频道。",
      specialUse: "它会播报已经过去的天气，也会偶尔提前说出明天。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="6" y="15" width="28" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="14" cy="24" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M23 21h7M23 26h7M13 15 27 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    },
    lighter: {
      name: "一次性打火机",
      cost: 2,
      price: 4,
      origin: "旧夏日，玻璃柜台",
      commonUse: "能点燃一小团火，通常撑不过一个夏天。",
      specialUse: "在这里点亮的火，会照见一段已经发生过的回忆。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="13" y="16" width="14" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M16 16v-3h8v3M20 11c-3-4-1-7 2-8 2 4 3 6-2 8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M17 23h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    },
    glassBottle: {
      name: "玻璃汽水瓶",
      cost: 4,
      price: 7,
      origin: "无眠车站，自动售货机",
      commonUse: "装汽水，喝完以后还能听见瓶口的风。",
      specialUse: "它可以收住一小段时间里的声音，盖紧以后不会立刻消失。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M16 7h8v6l3 5v13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V18l3-5V7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M14 21h12M17 7h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    },
    scarf: {
      name: "红围巾",
      cost: 15,
      price: 23,
      origin: "无名公路，失物箱",
      commonUse: "挡风，也能盖住一段不想被人听见的咳嗽。",
      specialUse: "围巾会记住上一个戴着它的人，在无名公路尤其清楚。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M11 10c6-3 13-2 18 2-7 1-14 4-19 9M29 12l-3 20M13 21l-3 12M11 18c5 1 10 1 15-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    },
    postcard: {
      name: "空白明信片",
      cost: 1,
      price: 3,
      origin: "无名公路，旧邮袋",
      commonUse: "能写字，但寄不到已经消失的地址。",
      specialUse: "写给任何人的字都会消失，只留下收件人的名字。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="6" y="10" width="28" height="20" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="m7 12 13 10 13-10M25 19h6M25 23h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>`
    },
    slippers: {
      name: "蓝白拖鞋",
      cost: 8,
      price: 12,
      origin: "雾港，旅店后门",
      commonUse: "适合在室内穿，也适合走到一半就忘记方向。",
      specialUse: "穿着它走出店门，会不知不觉走向最想见的人附近。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M8 16c0-4 8-5 10 0v12c0 4-9 4-10 0V16ZM22 12c0-4 8-4 10 0v16c0 4-9 4-10 0V12Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M10 15h6M24 11h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    },
    candle: {
      name: "停电蜡烛",
      cost: 10,
      price: 15,
      origin: "只有自动售货机的隧道",
      commonUse: "停电时照明，烧完以后只剩很短的一截。",
      specialUse: "没有电的时候，它会替人说话；0217 对它会有反应。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M13 20h14v13H13zM15 20v-3h10v3" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M20 15c-3-3-2-6 1-9 3 4 4 6-1 9Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>`
    },
    salt: {
      name: "盐包",
      cost: 2,
      price: 5,
      origin: "雾港，后厨补货箱",
      commonUse: "调味，也能在雪地上留下很浅的痕迹。",
      specialUse: "撒在无名公路上，可以暂时让看不见的脚步声安静下来。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M12 11h16l-2 21H14l-2-21ZM15 11V8h10v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M17 18h.01M22 21h.01M18 26h.01M24 27h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>`
    },
    expiredTicket: {
      name: "过期车票",
      cost: 0,
      price: 0,
      restockable: false,
      origin: "自动售货机投币口背面",
      commonUse: "已经不能上车，只能证明某个人曾经买过票。",
      specialUse: "它通往一个已经不存在的地方；也会成为包裹最后的收件地址。",
      icon: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M7 13h26v5a3 3 0 0 0 0 6v5H7v-5a3 3 0 0 0 0-6v-5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M18 15v2M18 20v2M18 25v2M22 18h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
    }
  },
  firstNight: {
    id: "fog-harbor",
    number: 1,
    place: "雾港公交站",
    scope: "第 1 夜 · 雾港公交站",
    title: "今晚的便利店",
    subtitle: "店里亮着六盏灯。先照顾谁，今晚就会记住谁。",
    weather: "小雨 · 末班车晚点",
    windowTitle: "雾港公交站",
    shelf: ["umbrella", "coffee", "lunchbox"],
    clockStart: "22:40",
    statusStart: "正在营业",
    closingTitle: "打烊前，今晚留下什么？",
    closingIntro: "商品总会被卖掉，留下来的东西才会跟着店去下一站。",
    cast: [
      {
        id: "acheng-1",
        name: "阿澄",
        initial: "澄",
        avatarClass: "",
        arrival: "第一位客人",
        line: "她拿起一把透明雨伞，却没有往门外走。",
        note: "她一直在看末班车到来的方向。",
        action: "接待阿澄",
        cost: "会花掉 1 个营业时间格",
        mode: "purchase",
        product: "umbrella",
        quantity: 1,
        prices: { low: 6, normal: 10, high: 14 },
        scene: [
          "她把最便宜的透明雨伞拿在手里，看了很久门外的雨。",
          "雨伞标价 ¥10。她口袋里的硬币碰在一起，响得很轻。"
        ],
        memory: {
          paid: "阿澄付了钱，却把透明雨伞靠在门边，没有带走。",
          gift: "你把透明雨伞送给了阿澄。她把它靠在门边，只带走了一句“谢谢”。"
        },
        quote: {
          low: "“少收了。……我记住了。”",
          paid: "“先放在门边吧。等雨来，我再拿。”",
          high: "“我把硬币都数过了，够的。”",
          gift: "“那我先替它看着门。等雨停了，再还你。”"
        },
        result: {
          paid: "她付了钱，却把伞靠在门边，没有拿走。货架上少了一把伞，门边多了一把。",
          gift: "她把伞靠在门边，没有拿走。她还是站在能看见末班车的地方。"
        },
        effect: {
          paid: { flagsOn: ["doorUmbrella"] },
          gift: { flagsOn: ["doorUmbrella"] }
        }
      },
      {
        id: "commuter-1",
        name: "赶路的人",
        initial: "路",
        avatarClass: "commuter",
        arrival: "普通客人",
        line: "他抓起一罐咖啡，硬币已经放在柜台上。",
        note: "普通交易不消耗营业时间。",
        action: "卖一罐咖啡 · ¥6",
        cost: "不耗时间",
        mode: "quick",
        product: "coffee",
        quantity: 1,
        amount: 6,
        memory: "赶路的人只买了一罐咖啡。他说，剩下的路还来得及。",
        toast: "赶路的人带着咖啡走了，没有耽误营业时间。"
      },
      {
        id: "shen-1",
        name: "沈伯",
        initial: "沈",
        avatarClass: "shen",
        arrival: "第二位常客",
        line: "他把两罐咖啡排得整整齐齐，只问了一句多少钱。",
        note: "夜班车到站前，他总会来。",
        action: "接待沈伯",
        cost: "会花掉 1 个营业时间格",
        mode: "purchase",
        product: "coffee",
        quantity: 2,
        prices: { low: 6, normal: 12, high: 18 },
        scene: [
          "他把两罐咖啡摆好，又替第二罐擦了擦罐口。",
          "两罐一共 ¥12。他的旧制服上还别着停运车队的徽章。"
        ],
        memory: {
          paid: "沈伯买了两罐咖啡，只打开一罐。另一罐留在柜台，像一封没有地址的信。",
          gift: "沈伯收下两罐咖啡，把没打开的那一罐留在柜台上，说给还没到的人。"
        },
        quote: {
          low: "“这怎么好意思。下一班车我给你带点热的。”",
          paid: "“这一罐先放着。还有人没到。”",
          high: "“该多少就多少。夜里做生意也不容易。”",
          gift: "“那这一罐算我欠店里的。”"
        },
        result: {
          paid: "他付了钱，只打开一罐。另一罐留在柜台，罐身还是温的。",
          gift: "沈伯收下两罐咖啡，只打开一罐。另一罐被端正地留在柜台上。"
        },
        effect: {
          paid: { flagsOn: ["unopenedCoffee"] },
          gift: { flagsOn: ["unopenedCoffee"] }
        }
      }
    ],
    task: {
      id: "featureLunchbox",
      name: "整理保温饭盒的位置",
      detail: "把最贵的东西放到最亮的地方",
      cost: "1 格",
      doneLabel: "饭盒已经在柜台旁",
      doneDetail: "它现在离门口更近",
      memory: "你把保温饭盒转到柜台最亮的位置，像在等一句话。",
      toast: "保温饭盒移到了柜台旁。",
      flagsOn: ["featuredLunchbox"]
    }
  },
  routes: {
    station: {
      id: "station",
      name: "无眠车站",
      clue: "咖啡罐盖上的站名还很清晰",
      summary: "这里没有人需要睡，钟却停在十一点。",
      nights: [
        {
          id: "sleepless-station-1",
          number: 2,
        simultaneous: true,
          place: "无眠车站",
          scope: "第 2 夜 · 无眠车站",
          title: "没有钟的车站",
          subtitle: "两个人同时站在柜台前，每个人都说自己不困。六盏灯照着六件还能做的事。",
          weather: "无风 · 夜班车不停",
          windowTitle: "无眠车站",
          shelf: ["umbrella", "coffee", "lunchbox", "candle", "salt"],
          localStock: { candle: 1, salt: 2 },
          clockStart: "00:10",
          statusStart: "正在营业",
          closingTitle: "第二夜打烊前，留下什么？",
          closingIntro: "车站不记时间。你留下的东西，会替你记住今晚几点。",
          cast: [
            {
              id: "clerk-1",
              name: "0217",
              initial: "零",
              avatarClass: "clerk",
              arrival: "临时店员",
              line: "她把一枚旧工资硬币推过柜台，说想换一罐咖啡。",
              note: "胸牌上只剩四个数字，比她本人更像一个名字。",
              waitedLine: "她看见沈伯先去柜台，问那罐没打开的咖啡是不是还留着。",
              action: "接待 0217",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "coin",
                  label: "请她喝一罐，收下那枚硬币",
                  detail: "咖啡少一罐，柜台上多一枚没有年份的工资币",
                  requiresStock: { coffee: 1 },
                  unavailable: "货架上的咖啡不够",
                  effect: {
                    time: 1,
                    stock: { coffee: -1 },
                    flagsOn: ["wageCoin"],
                    memory: "0217用一枚旧工资币换了一罐咖啡。她说，零头就不用找了。",
                    toast: "那枚工资币留在了收银台。"
                  }
                },
                {
                  id: "paid",
                  label: "照价卖给她",
                  detail: "收 ¥6，她把硬币丢进收银盒就不再说话",
                  requiresStock: { coffee: 1 },
                  unavailable: "货架上的咖啡不够",
                  effect: {
                    time: 1,
                    stock: { coffee: -1 },
                    cash: 6,
                    transaction: { label: "速溶咖啡 ×1", amount: 6 },
                    memory: "0217照价买了一罐咖啡。硬币落进收银盒时，她像是松了一口气。",
                    toast: "0217把咖啡带进了夜班休息室。"
                  }
                },
                {
                  id: "work",
                  label: "让她整理一次货架来换",
                  detail: "不收钱，但货架会被摆得比原来更整齐",
                  requiresStock: { coffee: 1 },
                  unavailable: "货架上的咖啡不够",
                  effect: {
                    time: 1,
                    stock: { coffee: -1 },
                    flagsOn: ["shelfTidy"],
                    memory: "0217整理完货架才接过咖啡。每罐都朝同一个方向，像等同一班车。",
                    toast: "货架被摆得整整齐齐。"
                  }
                }
              ]
            },
            {
              id: "driver-1",
              name: "夜班司机",
              initial: "夜",
              avatarClass: "commuter",
              arrival: "普通客人",
              line: "他买一罐咖啡，说这趟车不会有人睡着。",
              note: "普通交易不消耗营业时间。",
              action: "卖一罐咖啡 · ¥6",
              cost: "不耗时间",
              mode: "quick",
              product: "coffee",
              quantity: 1,
              amount: 6,
              memory: "夜班司机买了一罐咖啡。他说，这趟车上没有人需要睡着。",
              toast: "夜班司机带着咖啡回到了驾驶座。"
            },
            {
              id: "shen-2",
              name: "沈伯",
              initial: "沈",
              avatarClass: "shen",
              arrival: "回来的人",
              line: "他没有买咖啡，只问昨晚那罐没打开的还在不在。",
              note: "他的旧制服比上次更皱，第二罐咖啡的位置却没有忘。",
              waitedLine: "他先看了看 0217 刚才站过的地方，才把两罐咖啡放上柜台。",
              action: "接待沈伯",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "return-old",
                  label: "把留到今晚的咖啡递给他",
                  detail: "那罐咖啡从第一夜一直留在这里",
                  requiresFlag: "unopenedCoffee",
                  unavailable: "第一夜没有留下那罐咖啡",
                  effect: {
                    time: 1,
                    flagsOff: ["unopenedCoffee"],
                    flagsOn: ["shenReunion"],
                    memory: "沈伯接过那罐留了两夜的咖啡，第一次坐到柜台前把它打开。",
                    toast: "沈伯终于打开第二罐咖啡。"
                  }
                },
                {
                  id: "buy-new",
                  label: "从货架再拿两罐新的给他",
                  detail: "收 ¥12，新的咖啡会代替旧的等下去",
                  requiresStock: { coffee: 2 },
                  unavailable: "货架上的咖啡不够两罐",
                  effect: {
                    time: 1,
                    stock: { coffee: -2 },
                    cash: 12,
                    flagsOn: ["shenReunion"],
                    transaction: { label: "速溶咖啡 ×2", amount: 12 },
                    memory: "沈伯买了两罐新咖啡，仍只打开一罐。他说旧的那罐可以再等一等。",
                    toast: "沈伯留下了新的一罐。"
                  }
                },
                {
                  id: "wait",
                  label: "告诉他，柜台会一直留着位置",
                  detail: "不卖东西，也不追问他在等谁",
                  effect: {
                    time: 1,
                    memory: "你告诉沈伯，柜台会一直留着位置。他点点头，在站牌下坐了一夜。",
                    toast: "沈伯在站牌下坐了下来。"
                  }
                }
              ]
            },
          ],
          task: {
            id: "cleanClock",
            name: "擦亮那只停摆的钟",
            detail: "指针不会走，但玻璃上会照见店里的人",
            cost: "1 格",
            doneLabel: "钟面已经擦亮了",
            doneDetail: "十一点停在那里，不再催人",
            memory: "你擦亮了车站停摆的钟。指针仍旧不动，玻璃里却多了一盏店里的灯。",
            toast: "停摆的钟被擦亮了。",
            flagsOn: ["clockClean"]
          }
        },
        {
          id: "sleepless-station-2",
          number: 3,
          place: "无眠车站",
          scope: "第 3 夜 · 无眠车站",
          title: "最后一班不睡的车",
          subtitle: "今晚之后，店会离开。留一罐咖啡，还是留一盏灯？",
          weather: "无风 · 站牌翻到了空白一面",
          windowTitle: "无眠车站",
          shelf: ["umbrella", "coffee", "lunchbox", "candle", "salt"],
          clockStart: "23:20",
          statusStart: "正在营业",
          closingTitle: "最后一夜，店里留下什么？",
          closingIntro: "没有收件人的包裹已经放在柜台上。今晚要替它决定去处。",
          cast: [
            {
              id: "clerk-2",
              name: "0217",
              initial: "零",
              avatarClass: "clerk",
              arrival: "值最后一班的人",
              line: "她带着一只空饭盒来，说想装一点可以带走的声音。",
              note: "今晚以后，她会有一个真正的休息日。",
              action: "接待 0217",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "lunchbox",
                  label: "把保温饭盒卖给她",
                  detail: "收 ¥18，让她把声音和饭一起带走",
                  requiresStock: { lunchbox: 1 },
                  unavailable: "货架上的保温饭盒不够",
                  effect: {
                    time: 1,
                    stock: { lunchbox: -1 },
                    cash: 18,
                    flagsOn: ["clerkLunchbox"],
                    transaction: { label: "保温饭盒 ×1", amount: 18 },
                    memory: "0217买走了一只保温饭盒。她说，明天不工作的时候，也要记得吃饭。",
                    toast: "0217带着饭盒走进了第一束晨光。"
                  }
                },
                {
                  id: "note",
                  label: "用一罐咖啡换她留在盒里的字条",
                  detail: "咖啡少一罐，饭盒里会多一句没写完整的话",
                  requiresStock: { coffee: 1 },
                  unavailable: "货架上的咖啡不够",
                  effect: {
                    time: 1,
                    stock: { coffee: -1 },
                    flagsOn: ["clerkNote"],
                    memory: "0217用一张“明天见”的字条换走了一罐咖啡。字条没有写地址。",
                    toast: "饭盒里留下了一张字条。"
                  }
                },
                {
                  id: "rest",
                  label: "什么也不卖，让她在店里坐一会儿",
                  detail: "今晚的灯会替她看着时间",
                  effect: {
                    time: 1,
                    flagsOn: ["clerkRested"],
                    memory: "0217在柜台边坐了一会儿，没有买东西。她第一次没有替谁整理货架。",
                    toast: "0217在灯下坐了一会儿。"
                  }
                }
              ]
            },
            {
              id: "shen-3",
              name: "沈伯",
              initial: "沈",
              avatarClass: "shen",
              arrival: "来取最后一罐的人",
              line: "他把旧车队徽章放在柜台上，说今天可以不用再等了。",
              note: "第二罐咖啡终于有了去处，只差你替他打开。",
              action: "陪沈伯等到最后",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "open-together",
                  label: "把第二罐咖啡打开，陪他等完末班车",
                  detail: "今晚没有新的乘客，也没有催人的钟",
                  effect: {
                    time: 1,
                    flagsOn: ["shenClosed"],
                    memory: "你陪沈伯打开了第二罐咖啡。末班车没有来，他说这样也很好。",
                    toast: "沈伯把旧徽章留在了柜台上。"
                  }
                },
                {
                  id: "turn-sign",
                  label: "让他把站牌翻到空白的一面",
                  detail: "不再等某个没有写下来的终点",
                  effect: {
                    time: 1,
                    flagsOn: ["blankSign"],
                    memory: "沈伯把站牌翻到空白的一面。没有车名的方向，反而像是可以回家。",
                    toast: "站牌背面原来是空白的。"
                  }
                },
                {
                  id: "clock-reflect",
                  label: "让他看看擦亮的钟面",
                  detail: "钟还是停着，但玻璃里已经映出店里的灯",
                  quote: "“这盏灯……是店里那盏吧。”",
                  requiresFlag: "clockClean",
                  unavailable: "车站的钟还没有被擦亮",
                  effect: {
                    time: 1,
                    flagsOn: ["shenSawClock", "shenClosed"],
                    memory: "沈伯看着擦亮的钟面，第一次没有问末班车。他说，原来停下来的东西也会反光。",
                    toast: "沈伯在钟面里看见了店里的灯。"
                  }
                }
              ]
            },
            {
              id: "xiaoman-cameo-station",
              name: "小满",
              initial: "满",
              avatarClass: "xiaoman",
              arrival: "只在门外问一句的人",
              line: "她站在门外，没有进来，只问明天会不会有太阳。",
              note: "她问完天气，又看了一眼柜台上那罐一直没打开的咖啡。",
              action: "回答门外的小满",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "cameo-sunny",
                  label: "告诉她，明天会有太阳",
                  detail: "不卖东西，只给她一个可以带走的明天",
                  quote: "“沈伯那罐咖啡……还留着吗？那我明天再来拿。”",
                  effect: {
                    time: 1,
                    flagsOn: ["sunnyPromise", "xiaomanCameo"],
                    memory: "你告诉门外的小满明天会晴。她点点头，没有进门，只把一只空饭盒留在门边。",
                    toast: "小满把空饭盒留在了门边。"
                  }
                },
                {
                  id: "cameo-rain",
                  label: "照实说，雨还会下一阵",
                  detail: "不承诺晴天，只承认今晚还在下雨",
                  quote: "“那我先把今天过完。”",
                  effect: {
                    time: 1,
                    flagsOn: ["honestRain", "xiaomanCameo"],
                    memory: "你告诉小满雨还会下一阵。她说没关系，饭盒盖好就不会淋湿。",
                    toast: "小满抱着空饭盒走进了雨里。"
                  }
                }
              ]
            }
          ],
          task: {
            id: "bagParcel",
            name: "把没有收件人的包裹放上柜台",
            detail: "它很轻，像只装了一句没说完的话",
            cost: "1 格",
            doneLabel: "包裹已经在柜台上",
            doneDetail: "没有名字，也没有退件地址",
            memory: "你把没有收件人的包裹放到柜台上。它轻得像一句还没有说完的话。",
            toast: "包裹被放在了柜台中央。",
            flagsOn: ["parcelOnCounter"]
          }
        }
      ]
    },
    summer: {
      id: "summer",
      name: "倒着走的夏天",
      clue: "阿澄留下的伞尖还是温的",
      summary: "这里的天色从傍晚往午后倒退，客人总是先告别，再见面。",
      nights: [
        {
          id: "backward-summer-1",
          number: 2,
        simultaneous: true,
          place: "倒着走的夏天",
          scope: "第 2 夜 · 倒着走的夏天",
          title: "有人先说了再见",
          subtitle: "两个人同时站在门外，阴影却倒向早晨。六盏灯照着六件还没发生的事。",
          weather: "晴天之后下雨 · 影子向西",
          windowTitle: "倒着走的夏天",
          shelf: ["umbrella", "coffee", "lunchbox", "radio", "lighter", "glassBottle"],
          localStock: { radio: 1, lighter: 2, glassBottle: 1 },
          clockStart: "18:40",
          statusStart: "正在营业",
          closingTitle: "第二夜打烊前，留下什么？",
          closingIntro: "这里的人先告别，再见面。留下一样东西，也许下一次就能提前认出你。",
          cast: [
            {
              id: "xiaoman-1",
              name: "小满",
              initial: "满",
              avatarClass: "xiaoman",
              arrival: "隔着门问天气的人",
              line: "她站在门外，只问明天有没有太阳。",
              note: "她没有走进来，脚下的影子却先一步落在柜台边。",
              waitedLine: "她看见阿澄的伞还留在门边，问那个人是不是也在等。",
              action: "回答小满",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "sunny",
                  label: "告诉她，明天会有太阳",
                  detail: "卖给她一只饭盒，收 ¥18",
                  requiresStock: { lunchbox: 1 },
                  unavailable: "货架上的保温饭盒不够",
                  effect: {
                    time: 1,
                    stock: { lunchbox: -1 },
                    cash: 18,
                    flagsOn: ["sunnyPromise"],
                    transaction: { label: "保温饭盒 ×1", amount: 18 },
                    memory: "你告诉小满明天会晴。她买走一只保温饭盒，说要把晴天装进去。",
                    toast: "小满把“明天有太阳”带走了。"
                  }
                },
                {
                  id: "rainy",
                  label: "照实说，雨还会下一阵",
                  detail: "卖给她一只饭盒，收 ¥18",
                  requiresStock: { lunchbox: 1 },
                  unavailable: "货架上的保温饭盒不够",
                  effect: {
                    time: 1,
                    stock: { lunchbox: -1 },
                    cash: 18,
                    flagsOn: ["honestRain"],
                    transaction: { label: "保温饭盒 ×1", amount: 18 },
                    memory: "你告诉小满雨还会下一阵。她说没关系，饭盒盖好就不会淋湿。",
                    toast: "小满带着饭盒走进了倒退的雨里。"
                  }
                },
                {
                  id: "gift",
                  label: "把饭盒送给她，不收钱",
                  detail: "今晚不会多一笔收入，但门外会多一个晴天",
                  requiresStock: { lunchbox: 1 },
                  unavailable: "货架上的保温饭盒不够",
                  effect: {
                    time: 1,
                    stock: { lunchbox: -1 },
                    flagsOn: ["sunnyPromise"],
                    memory: "你把保温饭盒送给小满，还是没有回答明天。她把它抱在怀里，像抱住一小块太阳。",
                    toast: "小满抱着饭盒走进了雨里。"
                  }
                },
                {
                  id: "warm-keepsake",
                  label: "把柜台旁一直温着的饭盒递给她",
                  detail: "第一夜整理过的那只饭盒，终于等到了要用它的人",
                  quote: "“原来它一直在等我。”",
                  requiresFlag: "featuredLunchbox",
                  requiresStock: { lunchbox: 1 },
                  unavailable: "第一夜没有把保温饭盒搬到柜台旁，或饭盒已经不在",
                  effect: {
                    time: 1,
                    stock: { lunchbox: -1 },
                    flagsOn: ["xiaomanWarmStart", "sunnyPromise"],
                    memory: "小满接过那只一直放在柜台旁的饭盒。她第一次没有先问明天，而是先说了谢谢。",
                    toast: "小满抱住了柜台旁那只饭盒。"
                  }
                }
              ]
            },
            {
              id: "shadowless-1",
              name: "没有影子的人",
              initial: "影",
              avatarClass: "commuter",
              arrival: "普通客人",
              line: "他买一只饭盒，把一张空白明信片压在钱下面。",
              note: "普通交易不消耗营业时间。",
              action: "卖一只饭盒 · ¥18",
              cost: "不耗时间",
              mode: "quick",
              product: "lunchbox",
              quantity: 1,
              amount: 18,
              memory: "没有影子的人买走一只饭盒，留下了一张空白明信片。",
              toast: "空白明信片留在了柜台上。"
            },
            {
              id: "acheng-2",
              name: "阿澄",
              initial: "澄",
              avatarClass: "",
              arrival: "提前回来的人",
              line: "她拿来一张旧照片，说照片里的伞和门边那把一样。",
              note: "今天的她先说了再见，然后才推门进来。",
              waitedLine: "她看了一眼门外的小满，问那只空饭盒是不是她的。",
              action: "接待阿澄",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "exchange",
                  label: "用一把透明雨伞换那张旧照片",
                  detail: "伞少一把，柜台下多一张有人等过的照片",
                  requiresStock: { umbrella: 1 },
                  unavailable: "货架上的透明雨伞不够",
                  effect: {
                    time: 1,
                    stock: { umbrella: -1 },
                    flagsOn: ["oldPhoto"],
                    memory: "阿澄用一张旧照片换走一把新伞。照片边缘有一道雨水留下的浅痕。",
                    toast: "旧照片被压在了柜台玻璃下。"
                  }
                },
                {
                  id: "keep",
                  label: "把照片留在柜台，不收她的钱",
                  detail: "今晚不卖东西，只替她保管一段还没发生的过去",
                  effect: {
                    time: 1,
                    flagsOn: ["oldPhoto"],
                    memory: "阿澄把旧照片留在柜台上。照片里的她还没有学会等末班车。",
                    toast: "旧照片留了下来。"
                  }
                },
                {
                  id: "umbrella",
                  label: "告诉她，伞仍替她留在门边",
                  detail: "阿澄会先去一个不需要伞的地方",
                  effect: {
                    time: 1,
                    flagsOn: ["doorUmbrella"],
                    memory: "你告诉阿澄，伞仍替她留在门边。她笑着走进晴天，没有回头。",
                    toast: "阿澄的伞还靠在门边。"
                  }
                }
              ]
            }
          ],
          task: {
            id: "wipeGlass",
            name: "擦掉玻璃上的雨",
            detail: "让门外倒退的夏天看得更清楚一点",
            cost: "1 格",
            doneLabel: "玻璃已经擦干净了",
            doneDetail: "门外只剩一层很远的阳光",
            memory: "你擦掉玻璃上的雨，发现门外其实已经有阳光，只是之前没人愿意先看见。",
            toast: "玻璃上的雨被擦掉了。",
            flagsOn: ["clearGlass"]
          }
        },
        {
          id: "backward-summer-2",
          number: 3,
          place: "倒着走的夏天",
          scope: "第 3 夜 · 倒着走的夏天",
          title: "晴天来得很慢",
          subtitle: "阿澄决定不再等伞，小满决定把明天吃完。店里只剩最后六件事。",
          weather: "晴天 · 雨从地上落回云里",
          windowTitle: "倒着走的夏天",
          shelf: ["umbrella", "coffee", "lunchbox", "radio", "lighter", "glassBottle"],
          clockStart: "17:20",
          statusStart: "正在营业",
          closingTitle: "最后一夜，店里留下什么？",
          closingIntro: "没有收件人的包裹已经放在柜台上。今晚要替它决定去处。",
          cast: [
            {
              id: "xiaoman-2",
              name: "小满",
              initial: "满",
              avatarClass: "xiaoman",
              arrival: "来还晴天的人",
              line: "她抱着已经空了的饭盒，说晴天原来也要慢慢吃完。",
              note: "她终于走进了店里，脚下的影子和她站在一边。",
              action: "接待小满",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "warm-meal",
                  label: "替她把饭盒再热一次",
                  detail: "再卖她一只饭盒，收 ¥18",
                  requiresStock: { lunchbox: 1 },
                  unavailable: "货架上的保温饭盒不够",
                  effect: {
                    time: 1,
                    stock: { lunchbox: -1 },
                    cash: 18,
                    flagsOn: ["warmMeal"],
                    transaction: { label: "保温饭盒 ×1", amount: 18 },
                    memory: "小满又买了一只饭盒。她说这次会留一半给明天的自己。",
                    toast: "小满把热饭盒抱回了晴天。"
                  }
                },
                {
                  id: "move-light",
                  label: "把柜台的灯往门外挪一点",
                  detail: "灯还是那盏灯，门外的人会更早看见它",
                  effect: {
                    time: 1,
                    flagsOn: ["lightOutside"],
                    memory: "你把柜台的灯往门外挪了一点。小满说，原来店也可以先向客人走一步。",
                    toast: "灯照到了门外。"
                  }
                },
                {
                  id: "no-answer",
                  label: "告诉她，明天有没有太阳都没关系",
                  detail: "今天也可以好好过完",
                  effect: {
                    time: 1,
                    flagsOn: ["tomorrowAccepted"],
                    memory: "你告诉小满，明天有没有太阳都没关系。她点点头，把最后的饭粒吃完了。",
                    toast: "小满把空饭盒留在了门口。"
                  }
                },
                {
                  id: "clean-glass-show",
                  label: "让她看已经擦干净的玻璃",
                  detail: "门外其实一直有阳光，只是之前没人愿意先看见",
                  quote: "“我看见了。好像不用等明天也可以。”",
                  requiresFlag: "clearGlass",
                  unavailable: "玻璃上的雨还没有擦掉",
                  effect: {
                    time: 1,
                    flagsOn: ["xiaomanSawSun", "tomorrowAccepted"],
                    memory: "小满走到擦干净的玻璃前，第一次没有问明天。她说，原来今天已经有太阳了。",
                    toast: "小满在玻璃里看见了今天。"
                  }
                }
              ]
            },
            {
              id: "acheng-3",
              name: "阿澄",
              initial: "澄",
              avatarClass: "",
              arrival: "来买晴天的人",
              line: "她挑了一把透明雨伞，说今天不打算等雨。",
              note: "她没有往末班车来的方向看，只看着玻璃外的阳光。",
              action: "接待阿澄",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "buy-sunny",
                  label: "照价卖给她一把伞",
                  detail: "收 ¥10。晴天也可以为自己准备一把伞",
                  requiresStock: { umbrella: 1 },
                  unavailable: "货架上的透明雨伞不够",
                  effect: {
                    time: 1,
                    stock: { umbrella: -1 },
                    cash: 10,
                    flagsOn: ["achengLetGo"],
                    transaction: { label: "透明雨伞 ×1", amount: 10 },
                    memory: "阿澄在晴天买走一把伞。她第一次把伞带出了门，没有留在门边。",
                    toast: "阿澄撑着伞走进了晴天。"
                  }
                },
                {
                  id: "return-old",
                  label: "把门边那把旧伞还给她",
                  detail: "旧伞离开柜台，她会带着自己的等待回家",
                  requiresFlag: "doorUmbrella",
                  unavailable: "门边已经没有留下那把伞",
                  effect: {
                    time: 1,
                    flagsOff: ["doorUmbrella"],
                    flagsOn: ["achengLetGo"],
                    memory: "你把门边那把旧伞还给阿澄。她撑开它，发现伞面接住的雨已经变成了阳光。",
                    toast: "阿澄带走了门边那把旧伞。"
                  }
                },
                {
                  id: "gift-sunny",
                  label: "送她一把伞，让她不必再回来取",
                  detail: "今晚少一把伞，门外多一个可以向前走的人",
                  requiresStock: { umbrella: 1 },
                  unavailable: "货架上的透明雨伞不够",
                  effect: {
                    time: 1,
                    stock: { umbrella: -1 },
                    flagsOn: ["achengLetGo"],
                    memory: "你把一把透明雨伞送给阿澄。她说这次不会把它留在门边。",
                    toast: "阿澄带着伞走进了很慢的晴天。"
                  }
                }
              ]
            },
            {
              id: "shen-cameo-summer",
              name: "沈伯",
              initial: "沈",
              avatarClass: "shen",
              arrival: "在夏天问末班车的人",
              line: "他站在门外，问这里是不是也有一班不会来的末班车。",
              note: "他问夏天里那个总问天气的女孩，是不是也来过这里。",
              action: "回答门外的沈伯",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "cameo-coffee",
                  label: "告诉他，柜台会一直留着一罐咖啡",
                  detail: "不卖新的，只给第二罐留一个位置",
                  quote: "“那我就再等一班。小满刚才是不是也站在这里？”",
                  effect: {
                    time: 1,
                    flagsOn: ["shenReunion", "shenCameo"],
                    memory: "你告诉沈伯，柜台会一直留着一罐咖啡。他点点头，没有进门，只把旧车队徽章放在门边。",
                    toast: "沈伯把旧徽章留在了门边。"
                  }
                },
                {
                  id: "cameo-no-wait",
                  label: "告诉他，今晚不用再等",
                  detail: "不承诺车会来，只承认夏天已经够长",
                  quote: "“不用等也好。夏天还长。”",
                  effect: {
                    time: 1,
                    flagsOn: ["shenOffDuty", "shenCameo"],
                    memory: "你告诉沈伯，今晚不用再等。他看着倒退的夏天，第一次没有问末班车几点到。",
                    toast: "沈伯把旧车票收进了口袋。"
                  }
                }
              ]
            }
          ],
          task: {
            id: "turnPostcard",
            name: "把空白明信片翻到有字的一面",
            detail: "也许收件人的名字一直在背面",
            cost: "1 格",
            doneLabel: "明信片已经翻过来了",
            doneDetail: "上面只有一句：给还在路上的人",
            memory: "你把空白明信片翻过来。背面只有一句话：给还在路上的人。",
            toast: "明信片背面出现了一行字。",
            flagsOn: ["postcardRead"]
          }
        }
      ]
    }
  },
  finalArc: {
    nights: [
      {
        id: "nameless-road",
        number: 4,
        place: "无名公路",
        scope: "第 4 夜 · 无名公路 · 长夜",
        title: "没有路牌的那一段",
        subtitle: "导航在这里失去声音。这一夜会很长，六件旧货和六件事是店能给你的全部方向。",
        weather: "没有天空 · 车灯只照见前方",
        windowTitle: "无名公路",
        shelf: ["scarf", "slippers", "postcard", "lunchbox", "coffee", "salt"],
        localStock: { scarf: 1, slippers: 1, postcard: 2, salt: 2 },
        clockStart: "02:10",
        closingTitle: "无名公路打烊前，留下什么？",
        closingIntro: "这里没有地址，留下什么，什么就会成为路标。",
        interlude: {
          title: "路边的第二盏灯",
          text: "第一位客人离开后，公路边忽然亮起第二盏灯。它照着路肩上一只没有主人的箱子，也照着店里还没有说完的话。远处没有车声，只有灯丝在雨里轻轻响。你忽然意识到，这一夜还没有结束，只是暂时没有人在柜台前。",
          choices: [
            {
              id: "roadside-light",
              label: "把车灯转向路肩",
              detail: "先看看没有名字的地方留下了什么",
              flagsOn: ["roadsideLight"],
              memory: "你把车灯转向路肩。箱子旁边有一串很浅的脚印，像有人刚刚离开。",
              toast: "车灯照见了路肩上的脚印。"
            },
            {
              id: "counter-light",
              label: "让灯留在柜台上",
              detail: "先照顾店里还没有说完的话",
              flagsOn: ["counterLight"],
              memory: "你没有把灯转开。柜台上的影子停了一会儿，像在等下一句话。",
              toast: "柜台的灯继续亮着。"
            }
          ]
        },
        cast: [
          {
            id: "traveler-1",
            name: "无名旅人",
            initial: "旅",
            avatarClass: "traveler",
            arrival: "没有影子的客人",
            line: "他拿着一张空白明信片，说想买下来写给一个不存在的人。",
            note: "他的钱币上都印着不同的年份，却没有一枚属于今天。",
            action: "接待无名旅人",
            cost: "会花掉 1 个营业时间格",
            mode: "purchase",
            product: "postcard",
            quantity: 1,
            prices: { low: 1, normal: 3, high: 5 },
            scene: [
              "他把明信片对着车灯照了照，纸面上什么都没有。",
              "“写给谁都行。”他说，“只要最后能留下一个名字。”"
            ],
            memory: {
              paid: "无名旅人买走一张空白明信片，在收件人一栏写下了“还在路上的人”。",
              gift: "你把空白明信片送给了无名旅人。他写完以后，纸上的字全部消失，只剩一个名字。"
            },
            quote: {
              low: "“这么便宜？那我再买一张……算了，我好像没有第二个名字。”",
              paid: "“字会消失。名字留下就够了。”",
              high: "“钱我不太会算。你说够，那就够。”",
              gift: "“那我欠你一个地址。”"
            },
            result: {
              paid: "他付了钱，把明信片贴身放好。那张纸比他的影子还轻。",
              gift: "他把明信片举起来，店里的灯光第一次没有穿过他。"
            },
            effect: {
              paid: { flagsOn: ["travelerPostcard"] },
              gift: { flagsOn: ["travelerPostcard", "travelerOwesAddress"] }
            }
          },
          {
            id: "acheng-road",
            name: "阿澄",
            initial: "澄",
            avatarClass: "",
            arrival: "在路边等过的人",
            line: "她认出了货架上的红围巾，说那是母亲离开那天戴的颜色。",
            note: "她还是没有问到母亲有没有回来。",
            action: "听阿澄说起围巾",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "borrow-scarf",
                label: "把红围巾借给她挡风",
                detail: "围巾会记住她今晚没有等到的答案",
                requiresStock: { scarf: 1 },
                unavailable: "货架上的红围巾不够",
                effect: {
                  time: 1,
                  stock: { scarf: -1 },
                  flagsOn: ["roadScarf", "achengRoad"],
                  memory: "阿澄围上红围巾，终于承认自己不是在等末班车，而是在等母亲回来。",
                  toast: "阿澄带着红围巾走进了没有路牌的风里。"
                }
              },
              {
                id: "place-slippers",
                label: "把蓝白拖鞋放在门边",
                detail: "穿着它出门，会走向最想见的人附近",
                requiresStock: { slippers: 1 },
                unavailable: "货架上的蓝白拖鞋不够",
                effect: {
                  time: 1,
                  stock: { slippers: -1 },
                  flagsOn: ["slippersDoor", "achengRoad"],
                  memory: "你把蓝白拖鞋放在门边。阿澄没有穿，只把自己的鞋尖和它们并在一起。",
                  toast: "门边多了一双蓝白拖鞋。"
                }
              },
              {
                id: "listen",
                label: "不卖东西，只听她说完",
                detail: "今晚不给答案，只把话留在这里",
                effect: {
                  time: 1,
                  flagsOn: ["achengRoad"],
                  memory: "阿澄说了很多关于母亲的小事。没有一件能证明她会回来，但每一件都被记住了。",
                  toast: "阿澄在柜台前坐了很久。"
                }
              }
            ]
          },
          {
            id: "clerk-road",
            name: "0217",
            initial: "零",
            avatarClass: "clerk",
            arrival: "沿着工资币找来的人",
            line: "她带着一截烧短的蜡烛，说前面的路会突然变黑。",
            note: "她还在替一个没有营业的新店值班。",
            action: "听 0217 说完",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "candle-road",
                label: "给她一支新的停电蜡烛",
                detail: "收 ¥15，让她把黑掉的路照亮",
                requiresStock: { candle: 1 },
                unavailable: "货架上的停电蜡烛不够",
                effect: {
                  time: 1,
                  stock: { candle: -1 },
                  cash: 15,
                  flagsOn: ["candleRoad"],
                  transaction: { label: "停电蜡烛 ×1", amount: 15 },
                  memory: "0217买了一支停电蜡烛。她说这次不是替店值班，是替自己照路。",
                  toast: "0217把蜡烛带进了前面的黑暗。"
                }
              },
              {
                id: "salt-road",
                label: "把盐撒在公路边缘",
                detail: "让看不见的脚步声暂时安静下来",
                requiresStock: { salt: 1 },
                unavailable: "货架上的盐包不够",
                effect: {
                  time: 1,
                  stock: { salt: -1 },
                  flagsOn: ["saltRoad"],
                  memory: "你和 0217 把盐撒在公路边缘。身后的脚步声停了，前面的路第一次有了边界。",
                  toast: "公路上的脚步声安静下来。"
                }
              },
              {
                id: "rest-road",
                label: "让她在店里坐一会儿",
                detail: "不买蜡烛，也不问前面的路还有多远",
                effect: {
                  time: 1,
                  flagsOn: ["clerkRoadRest"],
                  memory: "0217在无名公路的店里坐了一会儿。她第一次没有把工牌正面朝上。",
                  toast: "0217在灯下休息了片刻。"
                }
              }
            ]
            },
            {
              id: "umbrella-mender",
              name: "修伞的老人",
              initial: "伞",
              avatarClass: "commuter",
              arrival: "来借一盏灯的人",
              line: "老人把三把断骨的伞放在柜台上，问门边那把是不是阿澄留下的。",
              note: "他不是来买伞的。他说，有些伞被撑开过一次，就再也折不回去。",
              action: "听修伞的老人说完",
              cost: "会花掉 1 个营业时间格",
              mode: "special",
              choices: [
                {
                  id: "give-rib",
                  label: "拆一把透明雨伞，给他做伞骨",
                  detail: "伞少一把，但老人的旧伞会重新撑开",
                  quote: "“伞骨不是断了，是还没找到该撑住的地方。”",
                  requiresStock: { umbrella: 1 },
                  unavailable: "货架上的透明雨伞不够",
                  effect: {
                    time: 1,
                    stock: { umbrella: -1 },
                    flagsOn: ["umbrellaMended", "menderMet"],
                    memory: "老人用透明雨伞的伞骨修好了自己的旧伞。他说，有些东西要拆开才能继续挡雨。",
                    toast: "修伞的老人撑开了那把旧伞。"
                  }
                },
                {
                  id: "keep-broken",
                  label: "让他把断骨的伞留在门边",
                  detail: "它撑不开，却可以替一个还没回来的人占着位置",
                  quote: "“撑不开的伞，也可以替人留个位置。”",
                  effect: {
                    time: 1,
                    flagsOn: ["brokenUmbrellaKept", "menderMet"],
                    memory: "老人把断骨的伞留在门边。它撑不开，却比货架上的伞更像一把伞。",
                    toast: "门边多了一把撑不开的伞。"
                  }
                },
                {
                  id: "refuse-mender",
                  label: "告诉他，店里今天不修伞",
                  detail: "不拆新伞，也不留下旧伞",
                  quote: "“不急。雨还会来。”",
                  effect: {
                    time: 1,
                    flagsOn: ["menderRefused", "menderMet"],
                    memory: "老人收起伞，没有生气。他说那就等下一场雨。",
                    toast: "修伞的老人走进了雨里。"
                  }
                }
              ]
            }
        ],
        task: {
          id: "turnRoadLight",
          name: "把车灯转向没有名字的地方",
          detail: "让无路可走的地方也有一点光",
          cost: "1 格",
          doneLabel: "车灯已经转向无名处",
          doneDetail: "黑暗里多了一条很浅的边",
          memory: "你把车灯转向没有名字的地方。那里没有路牌，却有一盏和店里一样的灯。",
          toast: "车灯照见了另一盏灯。",
          flagsOn: ["roadLight"]
        }
      },
      {
        id: "vending-tunnel",
        number: 5,
        place: "只有自动售货机的隧道",
        scope: "第 5 夜 · 自动售货机隧道",
        title: "投币口没有名字",
        subtitle: "六件事只能换六次回声。隧道那头的店，已经很久没有开门。",
        weather: "无风 · 售货机偶尔亮起",
        windowTitle: "自动售货机隧道",
        shelf: ["radio", "candle", "glassBottle", "postcard", "expiredTicket", "coffee"],
        localStock: { radio: 1, candle: 1, glassBottle: 1, postcard: 2, expiredTicket: 1 },
        clockStart: "03:20",
        closingTitle: "隧道打烊前，留下什么？",
        closingIntro: "自动售货机不收钱，只收一段你愿意留下的声音。",
        interlude: {
          title: "投币口里没有名字",
          text: "第一位客人离开后，隧道里的自动售货机忽然亮起。投币口没有投币，却吐出一张空白小票。小票很轻，像一句还没有决定要不要说出口的话。",
          choices: [
            {
              id: "machine-ticket-back",
              label: "把小票翻到背面",
              detail: "看看机器替谁保留了一句话",
              flagsOn: ["machineTicketBack"],
              memory: "小票背面只有一句话：下一站请替我记得。",
              toast: "空白小票背面浮出了一行字。"
            },
            {
              id: "machine-ticket-kept",
              label: "把小票留在投币口",
              detail: "不拿走机器留给下一个人的东西",
              flagsOn: ["machineTicketKept"],
              memory: "你没有拿走小票。机器亮了一会儿，又慢慢暗下去。",
              toast: "小票留在了投币口。"
            }
          ]
        },
        cast: [
          {
            id: "traveler-2",
            name: "无名旅人",
            initial: "旅",
            avatarClass: "traveler",
            arrival: "来取回声音的人",
            line: "他指着玻璃汽水瓶，说昨晚有一句话被留在了里面。",
            note: "他今天有影子了，但影子没有跟着他动。",
            action: "接待无名旅人",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "sell-bottle",
                label: "把玻璃汽水瓶卖给他",
                detail: "收 ¥7，让他把没说完的话带走",
                requiresStock: { glassBottle: 1 },
                unavailable: "货架上的玻璃汽水瓶不够",
                effect: {
                  time: 1,
                  stock: { glassBottle: -1 },
                  cash: 7,
                  flagsOn: ["travelerVoice"],
                  transaction: { label: "玻璃汽水瓶 ×1", amount: 7 },
                  memory: "无名旅人买走玻璃汽水瓶。瓶盖打开时，里面传出一句“我到了”。",
                  toast: "瓶子里的话终于有人听见了。"
                }
              },
              {
                id: "gift-bottle",
                label: "把瓶子送给他，不收钱",
                detail: "让他第一次拥有一段不需要归还的声音",
                requiresStock: { glassBottle: 1 },
                unavailable: "货架上的玻璃汽水瓶不够",
                effect: {
                  time: 1,
                  stock: { glassBottle: -1 },
                  flagsOn: ["travelerVoice", "travelerBottleGift"],
                  memory: "你把玻璃汽水瓶送给无名旅人。他把耳朵贴上去，听了很久很久。",
                  toast: "无名旅人抱着一只空瓶子离开了。"
                }
              },
              {
                id: "keep-bottle",
                label: "告诉他，那句话还不是留给他的",
                detail: "把瓶子留在店里，等对的人来",
                effect: {
                  time: 1,
                  flagsOn: ["bottleWaiting"],
                  memory: "你没有把瓶子交给无名旅人。他没有生气，只说那自己再往前面找找。",
                  toast: "玻璃瓶留在了货架上。"
                }
              }
            ]
          },
          {
            id: "xiaoman-tunnel",
            name: "小满",
            initial: "满",
            avatarClass: "xiaoman",
            arrival: "来等天气预报的人",
            line: "她抱着旧收音机，问它能不能播到明天的太阳。",
            note: "收音机的旋钮停在一个已经不存在的频道。",
            action: "接待小满",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "sell-radio",
                label: "把旧收音机卖给她",
                detail: "收 ¥30，让她自己决定相信哪一个天气",
                requiresStock: { radio: 1 },
                unavailable: "货架上的旧收音机不够",
                effect: {
                  time: 1,
                  stock: { radio: -1 },
                  cash: 30,
                  flagsOn: ["xiaomanRadio"],
                  transaction: { label: "旧收音机 ×1", amount: 30 },
                  memory: "小满买走旧收音机。她转了很久旋钮，最后收到一句“明天见”。",
                  toast: "旧收音机在小满怀里响了一声。"
                }
              },
              {
                id: "play-weather",
                label: "替她调到一个有太阳的频道",
                detail: "收音机会留在店里，但她能听完这一晚",
                requiresStock: { radio: 1 },
                unavailable: "货架上的旧收音机不够",
                effect: {
                  time: 1,
                  flagsOn: ["sunnyChannel"],
                  memory: "你替小满调到有太阳的频道。播音员说，倒着走的夏天也可以有一个明确的下午。",
                  toast: "收音机里传出了很久以前的晴天。"
                }
              },
              {
                id: "radio-quiet",
                label: "陪她听一会儿杂音",
                detail: "不承诺明天，也不关掉收音机",
                effect: {
                  time: 1,
                  flagsOn: ["quietRadio"],
                  memory: "你和小满听了一会儿杂音。她说，原来没有天气预报也不算坏消息。",
                  toast: "收音机里的杂音慢慢轻了。"
                }
              }
            ]
          },
          {
            id: "clerk-tunnel",
            name: "0217",
            initial: "零",
            avatarClass: "clerk",
            arrival: "来换停电蜡烛的人",
            line: "她把最后一张工资单折成硬币大小，问蜡烛还能不能便宜一点。",
            note: "自动售货机亮着，却什么也卖不出来。",
            action: "接待 0217",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "candle-tunnel",
                label: "用工资单换她一支蜡烛",
                detail: "蜡烛少一支，收银台多一张皱掉的工资单",
                requiresStock: { candle: 1 },
                unavailable: "货架上的停电蜡烛不够",
                effect: {
                  time: 1,
                  stock: { candle: -1 },
                  flagsOn: ["clerkPayslip"],
                  memory: "0217用工资单换走一支蜡烛。工资单上的日期比隧道里的每台机器都新。",
                  toast: "工资单被压在了收银盒下面。"
                }
              },
              {
                id: "sell-candle",
                label: "照价卖给她一支蜡烛",
                detail: "收 ¥15，让她先把前面的灯点起来",
                requiresStock: { candle: 1 },
                unavailable: "货架上的停电蜡烛不够",
                effect: {
                  time: 1,
                  stock: { candle: -1 },
                  cash: 15,
                  flagsOn: ["clerkTunnel"],
                  transaction: { label: "停电蜡烛 ×1", amount: 15 },
                  memory: "0217照价买了一支蜡烛。她说今晚值完班，就真的可以休息了。",
                  toast: "0217点着蜡烛走进了隧道。"
                }
              },
              {
                id: "rest-tunnel",
                label: "让她靠着售货机睡一会儿",
                detail: "今晚不卖东西，灯也不会熄",
                effect: {
                  time: 1,
                  flagsOn: ["clerkSlept"],
                  memory: "0217靠着自动售货机睡着了。机器没有收费，灯替她亮了一夜。",
                  toast: "0217在售货机旁睡着了。"
                }
              }
            ]
          }
        ],
        task: {
          id: "postcardVending",
          name: "把空白明信片塞进投币口",
          detail: "机器不收钱，但也许会收下一句没有地址的话",
          cost: "1 格",
          doneLabel: "明信片已经进了投币口",
          doneDetail: "售货机吐出一张过期的车票",
          memory: "你把空白明信片塞进投币口。售货机响了很久，吐出一张早已过期的车票。",
          toast: "售货机吐出了一张过期车票。",
          flagsOn: ["ticketFound"]
        }
      },
      {
        id: "station-return",
        number: 6,
        place: "无眠车站",
        scope: "第 6 夜 · 无眠车站",
        title: "站牌背面有人写过字",
        subtitle: "店绕了一圈又回到这里。钟还是十一点，等人的位置却多了一个。",
        weather: "无风 · 末班车停在站外",
        windowTitle: "无眠车站",
        shelf: ["coffee", "lunchbox", "postcard", "candle", "salt", "umbrella"],
        localStock: { candle: 1, salt: 1 },
        clockStart: "23:10",
        closingTitle: "车站打烊前，留下什么？",
        closingIntro: "车没有开走。今晚要决定，是继续等，还是把站牌翻过去。",
        cast: [
          {
            id: "shen-return-final",
            name: "沈伯",
            initial: "沈",
            avatarClass: "shen",
            arrival: "第三位等车的人",
            line: "他把一张过期车票放在柜台上，说这次真的有人没到。",
            note: "他不再问咖啡多少钱，只问车票还能不能算数。",
            action: "接待沈伯",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "ticket-and-coffee",
                label: "把过期车票和两罐咖啡交给他",
                detail: "让他替没到的人保管最后一次上车凭证",
                requiresStock: { expiredTicket: 1, coffee: 2 },
                unavailable: "还缺过期车票或两罐咖啡",
                effect: {
                  time: 1,
                  stock: { expiredTicket: -1, coffee: -2 },
                  flagsOn: ["shenClosedLoop"],
                  memory: "沈伯拿着过期车票和两罐咖啡坐进末班车。他终于替第二罐咖啡等到了人。",
                  toast: "沈伯把第二罐咖啡放到了空座位上。"
                }
              },
              {
                id: "ticket-only",
                label: "只把过期车票交给他",
                detail: "不提供新的咖啡，让旧的那一罐继续等",
                requiresStock: { expiredTicket: 1 },
                unavailable: "还没有找到过期车票",
                effect: {
                  time: 1,
                  stock: { expiredTicket: -1 },
                  flagsOn: ["shenHasTicket"],
                  memory: "沈伯收下过期车票，把它夹在旧制服胸前的口袋里。他没有再提那罐咖啡。",
                  toast: "过期车票有了一个保管人。"
                }
              },
              {
                id: "sit-with-shen",
                label: "陪他在站牌下坐到最后",
                detail: "不卖东西，只让这一班车晚一点到",
                effect: {
                  time: 1,
                  flagsOn: ["shenSits"],
                  memory: "你和沈伯在站牌下坐到天亮。末班车没有来，但谁也没有先离开。",
                  toast: "站牌下多了一盏一直没有关的灯。"
                }
              },
              {
                id: "machine-ticket",
                label: "把售货机吐出的旧车票交给他",
                detail: "那张票已经过期，但站名还认得出来",
                quote: "“票过期了，路没有。”",
                requiresFlag: "ticketFound",
                unavailable: "自动售货机还没有吐出旧车票",
                effect: {
                  time: 1,
                  flagsOn: ["shenHasTicket", "shenClosedLoop"],
                  memory: "沈伯接过售货机吐出的旧车票，看了很久。他说，原来这条路一直留着回程。",
                  toast: "沈伯收下了售货机的旧车票。"
                }
              }
            ]
          },
          {
            id: "clerk-return",
            name: "0217",
            initial: "零",
            avatarClass: "clerk",
            arrival: "来交还工牌的人",
            line: "她把工牌放在柜台上，说过期车票应该由店里收好。",
            note: "她第一次没有站在价签机旁边。",
            action: "接待 0217",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "take-badge",
                label: "收下她的旧工牌",
                detail: "不卖东西，让这间店替她保管值班的证明",
                effect: {
                  time: 1,
                  flagsOn: ["clerkBadge"],
                  memory: "0217把旧工牌留在柜台上。数字 0217 被擦得很亮，像她终于不再只是编号。",
                  toast: "旧工牌被放进了收银盒。"
                }
              },
              {
                id: "coffee-break",
                label: "请她喝一罐咖啡",
                detail: "咖啡少一罐，今晚不用值班",
                requiresStock: { coffee: 1 },
                unavailable: "货架上的咖啡不够",
                effect: {
                  time: 1,
                  stock: { coffee: -1 },
                  flagsOn: ["clerkOffDuty"],
                  memory: "0217接过咖啡，却没有打开。她说要留到明天不工作的时候。",
                  toast: "0217把咖啡放进了自己的包里。"
                }
              },
              {
                id: "walk-away",
                label: "让她直接下班",
                detail: "不检查货架，也不整理最后一张收据",
                effect: {
                  time: 1,
                  flagsOn: ["clerkLeaves"],
                  memory: "0217没有买任何东西，直接走出了车站。那是她第一次准时下班。",
                  toast: "0217第一次准时离开了车站。"
                }
              }
            ]
          },
          {
            id: "flower-girl",
            name: "卖花的女孩",
            initial: "花",
            avatarClass: "xiaoman",
            arrival: "来换一只瓶子的客人",
            line: "她抱着一束快要谢掉的白色小花，说想换一只能装水的瓶子。",
            note: "她说小满昨天也在这里买过一只空饭盒，花却一直朝着店里的灯开。",
            action: "接待卖花的女孩",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "flower-bottle",
                label: "用玻璃汽水瓶换她一朵花",
                detail: "瓶子少一只，花会在没有太阳的车站里多开一晚",
                quote: "“小满说，只要有人看见，花就不算白开。”",
                requiresStock: { glassBottle: 1 },
                unavailable: "货架上的玻璃汽水瓶不够",
                effect: {
                  time: 1,
                  stock: { glassBottle: -1 },
                  flagsOn: ["flowerInBottle", "flowerGirlMet"],
                  memory: "女孩把花插进玻璃瓶。瓶口的风停了，花在没有太阳的车站里多开了一晚。",
                  toast: "柜台上多了一瓶白花。"
                }
              },
              {
                id: "flower-counter",
                label: "把花留在柜台上，不收她的钱",
                detail: "花不需要地址，只需要有一个人看见",
                quote: "“那就让它替我在这里待一会儿。”",
                effect: {
                  time: 1,
                  flagsOn: ["flowerOnCounter", "flowerGirlMet"],
                  memory: "女孩把花留在柜台上。她说花不需要地址，只要有一个人看见。",
                  toast: "柜台上留下了一小束白花。"
                }
              },
              {
                id: "flower-refuse",
                label: "告诉她，店里没有能装花的瓶子",
                detail: "不换瓶子，也不留下花",
                quote: "“没关系，花还会再开一次。”",
                effect: {
                  time: 1,
                  flagsOn: ["flowerGirlRefused", "flowerGirlMet"],
                  memory: "女孩抱着花走出门。夏天把她的影子拉得很长。",
                toast: "卖花的女孩走进了车站的灯里。"
                }
              }
            ]
          },
          {
            id: "cat-finder",
            name: "找猫的人",
            initial: "猫",
            avatarClass: "traveler",
            arrival: "沿着盐粒走来的人",
            line: "她沿着柜台边的盐粒一路找来，问有没有看见一只没有影子的黑猫。",
            note: "她说 0217 提过，猫只在停摆的钟附近出现，钟一走，猫就会回来。",
            action: "帮她找猫",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "cat-candle",
                label: "把停电蜡烛借给她",
                detail: "蜡烛少一支，钟后面会多一声很轻的猫叫",
                quote: "“0217说它怕黑，也怕我不去找它。”",
                requiresStock: { candle: 1 },
                unavailable: "货架上的停电蜡烛不够",
                effect: {
                  time: 1,
                  stock: { candle: -1 },
                  flagsOn: ["catFound", "catFinderMet"],
                  memory: "她举着蜡烛走进钟后面。黑暗里传来一声很轻的猫叫，像有人终于应了她的名字。",
                  toast: "钟后面传来了一声猫叫。"
                }
              },
              {
                id: "cat-salt",
                label: "把盐撒到钟座下面",
                detail: "盐少一包，钟座下会多一条猫能认出的路",
                quote: "“它记得自己走过的路。”",
                requiresStock: { salt: 1 },
                unavailable: "货架上的盐包不够",
                effect: {
                  time: 1,
                  stock: { salt: -1 },
                  flagsOn: ["catTrail", "catFinderMet"],
                  memory: "盐粒在钟座下排成一条细线。她说猫会沿着这条线回来，因为猫记得自己走过的路。",
                  toast: "钟座下多了一条盐粒小路。"
                }
              },
              {
                id: "cat-gone",
                label: "告诉她，猫可能已经先走了",
                detail: "不借蜡烛，也不撒盐",
                quote: "“那我再找一站。它总得在某一站等我。”",
                effect: {
                  time: 1,
                  flagsOn: ["catGone", "catFinderMet"],
                  memory: "她把空猫笼抱在怀里，说那就再找一站。",
                  toast: "找猫的人走向了下一盏灯。"
                }
              }
            ]
          },
          {
            id: "driver-return",
            name: "夜班司机",
            initial: "夜",
            avatarClass: "commuter",
            arrival: "普通客人",
            line: "他买走一罐咖啡，说末班车终于可以改名叫首班车。",
            note: "普通交易不消耗营业时间。",
            action: "卖一罐咖啡 · ¥6",
            cost: "不耗时间",
            mode: "quick",
            product: "coffee",
            quantity: 1,
            amount: 6,
            memory: "夜班司机买走一罐咖啡。他说末班车停在站外，却没有人急着上去了。",
            toast: "夜班司机把咖啡带回了驾驶座。"
          }
        ],
        task: {
          id: "rewindClock",
          name: "把停摆的钟拨回一分钟",
          detail: "不退车票，只让某个人多等一分钟",
          cost: "1 格",
          doneLabel: "钟向后退了一分钟",
          doneDetail: "十一点零分变成了十点五十九分",
          memory: "你把停摆的钟拨回一分钟。沈伯抬头看了看，像是终于等到了一点时间。",
          toast: "车站的钟向后退了一分钟。",
          flagsOn: ["clockRewound"]
        }
      },
      {
        id: "summer-return",
        number: 7,
        place: "倒着走的夏天",
        scope: "第 7 夜 · 倒着走的夏天",
        title: "最后一个没有发生的下午",
        subtitle: "影子已经正过来。还有六件事，可以留在这个夏天结束以前。",
        weather: "晴天 · 雨正从地面升回云里",
        windowTitle: "倒着走的夏天",
        shelf: ["umbrella", "lunchbox", "radio", "lighter", "glassBottle", "candle"],
        localStock: { radio: 1, lighter: 1, glassBottle: 1 },
        clockStart: "16:40",
        closingTitle: "夏天打烊前，留下什么？",
        closingIntro: "这是最后一个倒着走的下午。留下一件东西，它就不会跟着时间消失。",
        interlude: {
          title: "夏天多出来的一分钟",
          text: "第一位客人离开后，柜台后的夕阳忽然停住。钟没有走，夏天却多出一分钟。门外没有人，只有一盏灯还亮着。",
          choices: [
            {
              id: "extra-minute-outside",
              label: "把这一分钟留给门外的人",
              detail: "让还没有走到的人多一盏灯的时间",
              flagsOn: ["extraMinuteGiven"],
              memory: "你把多出来的一分钟留在门外。灯影里有人停了一下，又继续往前走。",
              toast: "门外多亮了一分钟。"
            },
            {
              id: "extra-minute-counter",
              label: "把这一分钟收进柜台",
              detail: "不催夏天，也不催还没说完的话",
              flagsOn: ["extraMinuteKept"],
              memory: "你把这一分钟收进柜台。店里的钟没有动，夏天却慢了一点。",
              toast: "柜台里多了一分钟。"
            }
          ]
        },
        cast: [
          {
            id: "acheng-summer-final",
            name: "阿澄",
            initial: "澄",
            avatarClass: "",
            arrival: "不再等车的人",
            line: "她拿着一张写了收件人的明信片，说这一次不打算把伞留下。",
            note: "她还是会看站牌，只是不再把整个下午都交给它。",
            action: "接待阿澄",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "umbrella-forward",
                label: "卖给她一把能带走的伞",
                detail: "收 ¥10。这次她要把伞带出店门",
                requiresStock: { umbrella: 1 },
                unavailable: "货架上的透明雨伞不够",
                effect: {
                  time: 1,
                  stock: { umbrella: -1 },
                  cash: 10,
                  flagsOn: ["achengForward"],
                  transaction: { label: "透明雨伞 ×1", amount: 10 },
                  memory: "阿澄买走一把透明雨伞，这一次没有把它靠在门边。",
                  toast: "阿澄撑着伞走进了正在结束的夏天。"
                }
              },
              {
                id: "postcard-name",
                label: "把写有名字的明信片交给她",
                detail: "让她知道，母亲有没有回来并不是她一个人要回答的问题",
                requiresStock: { postcard: 1 },
                unavailable: "货架上的空白明信片不够",
                effect: {
                  time: 1,
                  stock: { postcard: -1 },
                  flagsOn: ["achengLetter"],
                  memory: "阿澄买下明信片，在收件人一栏写下自己的名字。她说这次至少会寄到。",
                  toast: "明信片第一次有了一个能收到的地址。"
                }
              },
              {
                id: "let-go-umbrella",
                label: "把门边的旧伞还给她",
                detail: "旧伞离开柜台，她就可以不再回来取",
                requiresFlag: "doorUmbrella",
                unavailable: "门边已经没有留下那把旧伞",
                effect: {
                  time: 1,
                  flagsOff: ["doorUmbrella"],
                  flagsOn: ["achengForward", "achengOldUmbrella"],
                  memory: "你把门边那把旧伞还给阿澄。她撑开它，里面落下的不是雨，是一整个下午的光。",
                  toast: "阿澄终于带走了那把旧伞。"
                }
              }
            ]
          },
          {
            id: "shen-summer-final",
            name: "沈伯",
            initial: "沈",
            avatarClass: "shen",
            arrival: "来找旧车票的人",
            line: "他问店里是否还有一张能回到停运以前的票。",
            note: "旧车队徽章被他擦得很亮，像今天还要发车。",
            action: "接待沈伯",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "light-ticket",
                label: "用打火机替他照亮旧车票",
                detail: "不烧掉车票，只让背面的字显出来",
                requiresStock: { lighter: 1 },
                unavailable: "货架上的打火机不够",
                effect: {
                  time: 1,
                  stock: { lighter: -1 },
                  flagsOn: ["shenTicketLit"],
                  memory: "打火机的火光照过旧车票，背面浮出一行字：末班车从来没有停运。",
                  toast: "旧车票背面出现了新的字。"
                }
              },
              {
                id: "give-postcard",
                label: "给他一张写给下一班车的明信片",
                detail: "让地址空着，但让收件人有一个位置",
                requiresStock: { postcard: 1 },
                unavailable: "货架上的空白明信片不够",
                effect: {
                  time: 1,
                  stock: { postcard: -1 },
                  flagsOn: ["shenPostcard"],
                  memory: "沈伯在收件人一栏写下“还没到的人”，把明信片夹进旧制服。",
                  toast: "明信片被放进旧制服口袋。"
                }
              },
              {
                id: "let-shen-go",
                label: "告诉他，今天不用再发车",
                detail: "没有车票，也可以回家",
                effect: {
                  time: 1,
                  flagsOn: ["shenOffDuty"],
                  memory: "沈伯摘下旧车队徽章放在柜台上。他说今天不等人，也不发车。",
                  toast: "旧徽章留在了柜台上。"
                }
              },
              {
                id: "clock-minute-shen",
                label: "告诉他，停摆的钟已经走过一分钟",
                detail: "那一分钟没有人看见，但时间确实动过",
                quote: "“一分钟也够发车了。”",
                requiresFlag: "clockRewound",
                unavailable: "还没有把停摆的钟拨回一分钟",
                effect: {
                  time: 1,
                  flagsOn: ["shenOffDuty", "shenSawClock"],
                  memory: "沈伯听见钟已经走过一分钟，终于把旧徽章摘下来。他说，那就从这一分钟开始回家。",
                  toast: "沈伯把旧徽章留在了柜台上。"
                }
              }
            ]
          },
          {
            id: "xiaoman-summer-final",
            name: "小满",
            initial: "满",
            avatarClass: "xiaoman",
            arrival: "来还晴天的人",
            line: "她抱着空饭盒，说夏天已经吃完了，想把最后一点热留给店里。",
            note: "她的影子终于和脚步一起移动。",
            action: "接待小满",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "warm-final",
                label: "替她把空饭盒热一遍",
                detail: "卖给她一只饭盒，收 ¥18",
                requiresStock: { lunchbox: 1 },
                unavailable: "货架上的保温饭盒不够",
                effect: {
                  time: 1,
                  stock: { lunchbox: -1 },
                  cash: 18,
                  flagsOn: ["xiaomanWarmFinal"],
                  transaction: { label: "保温饭盒 ×1", amount: 18 },
                  memory: "小满又买了一只饭盒。她说要把最后一点热留给明天还没开始的自己。",
                  toast: "小满抱着热饭盒走进了晴天。"
                }
              },
              {
                id: "radio-last",
                label: "把收音机调到最后一个频道",
                detail: "让她听完一段没有坏消息的天气",
                requiresStock: { radio: 1 },
                unavailable: "货架上的旧收音机不够",
                effect: {
                  time: 1,
                  flagsOn: ["lastWeather"],
                  memory: "旧收音机播出最后一段天气：明天有太阳，也可能下雨，但都会过去。",
                  toast: "收音机播完了最后一段天气。"
                }
              },
              {
                id: "bottle-light",
                label: "把玻璃瓶举向夕阳",
                detail: "把晴天装进去，留给她下次经过",
                requiresStock: { glassBottle: 1 },
                unavailable: "货架上的玻璃汽水瓶不够",
                effect: {
                  time: 1,
                  stock: { glassBottle: -1 },
                  flagsOn: ["summerBottle"],
                  memory: "你把夕阳装进玻璃瓶。小满说，这是一份可以留到下一个夏天的晴天。",
                  toast: "玻璃瓶里留下了一小块阳光。"
                }
              }
            ]
          }
        ],
        task: {
          id: "carryLightOut",
          name: "把柜台的灯往门外挪一点",
          detail: "让回来的人不用走到门口才看见营业",
          cost: "1 格",
          doneLabel: "灯光已经照到门外",
          doneDetail: "门前的夏天亮了一小块",
          memory: "你把柜台的灯往门外挪了一点。夏天向后退了一步，却没有催人离开。",
          toast: "灯光照到了门外的夏天。",
          flagsOn: ["lightOutsideFinal"]
        }
      },
      {
        id: "parcel-morning",
        number: 8,
        place: "雾港公交站",
        scope: "第 8 夜 · 雾港公交站",
        title: "没有收件人的包裹",
        subtitle: "五个等过同一班车的人回到店里。包裹拆开以后，他们会各自离开，或继续留在原地。",
        weather: "小雨将停 · 第一班车还没有来",
        windowTitle: "雾港公交站",
        shelf: ["postcard", "expiredTicket", "candle", "glassBottle", "umbrella", "lunchbox"],
        localStock: { postcard: 1, expiredTicket: 1 },
        clockStart: "04:30",
        closingTitle: "最后一夜，包裹去哪里？",
        closingIntro: "第一班车即将到站。把包裹放上柜台后，就可以决定拆开或封存；每个人刚才给出的回答，都会留在这一夜的结局里。",
        cast: [
          {
            id: "traveler-final",
            name: "无名旅人",
            initial: "旅",
            avatarClass: "traveler",
            arrival: "来取收件人名字的人",
            line: "他把阿澄的纸角、沈伯的车票、0217的工牌和小满的饭盒排在一起。",
            note: "他终于有了影子，却不知道包裹上应该写谁的名字。",
            action: "听无名旅人说完",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "name-on-postcard",
                label: "把空白明信片递给他",
                detail: "让包裹第一次拥有一个可以写的收件人",
                quote: "“写我自己的名字……可以吗？我怕写上去，明天又忘了。”",
                requiresStock: { postcard: 1 },
                unavailable: "货架上的空白明信片不够",
                effect: {
                  time: 1,
                  stock: { postcard: -1 },
                  flagsOn: ["parcelNamed", "travelerFinal", "travelerClosure"],
                  memory: "无名旅人在明信片上写下自己的名字。字迹没有消失，包裹终于停了下来。",
                  toast: "包裹的收件人有了一个名字。"
                }
              },
              {
                id: "address-on-ticket",
                label: "把过期车票夹进包裹",
                detail: "让包裹去往一个已经不存在的地方",
                quote: "“这个站我好像去过。也可能只是记得有人在那里等过。”",
                requiresStock: { expiredTicket: 1 },
                unavailable: "还没有找到过期车票",
                effect: {
                  time: 1,
                  stock: { expiredTicket: -1 },
                  flagsOn: ["parcelAddress", "travelerFinal", "travelerClosure"],
                  memory: "无名旅人把过期车票夹进包裹。地址栏里没有街名，只有一个早已停运的站。",
                  toast: "包裹有了一个不存在的地址。"
                }
              },
              {
                id: "let-him-hold",
                label: "让他先抱着包裹坐一会儿",
                detail: "不写名字，也不急着决定去路",
                quote: "“我就坐一会儿。要是天亮前又想不起来，你别叫醒我。”",
                effect: {
                  time: 1,
                  flagsOn: ["travelerFinal", "travelerClosure", "travelerRested"],
                  memory: "无名旅人抱着包裹坐到天亮。他什么也没写，却第一次没有站在门外。",
                  toast: "无名旅人在柜台边坐下。"
                }
              },
              {
                id: "postcard-back-memory",
                label: "告诉他，明信片上写着“给还在路上的人”",
                detail: "夏天翻过来的那一面，终于在这里用上",
                quote: "“原来收件人一直是我。”",
                requiresFlag: "postcardRead",
                unavailable: "还没有翻过那张空白明信片的背面",
                effect: {
                  time: 1,
                  flagsOn: ["parcelNamed", "travelerFinal", "travelerClosure"],
                  memory: "无名旅人听见明信片背面的那句话，终于把自己的名字写在了收件人一栏。",
                  toast: "包裹的收件人终于有了名字。"
                }
              }
            ]
          },
          {
            id: "acheng-final",
            name: "阿澄",
            initial: "澄",
            avatarClass: "",
            arrival: "来等第一班车的人",
            line: "她没有带伞。手心里攥着一张从包裹里露出来的旧纸角。",
            note: "这一次她没有看站牌，只看着你。",
            action: "接待阿澄",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "achengg-final-page",
                label: "把写着阿澄名字的那一页交给她",
                detail: "让她知道母亲没有回来，并不是因为她等得不够久",
                quote: "“原来不是我等得不够久。……伞先放着吧。”",
                effect: {
                  time: 1,
                  flagsOn: ["achengClosure", "parcelOpenedForAcheng"],
                  memory: "阿澄读完那一页，终于把湿掉的伞留在店里。她说这次不等了，但不是因为放弃。",
                  toast: "阿澄把伞留在了门边。"
                }
              },
              {
                id: "acheng-final-umbrella",
                label: "把门边那把旧伞还给她",
                detail: "让她带走自己的等待，而不是继续替它守门",
                quote: "“原来撑开它，也没有那么难。”",
                requiresFlag: "doorUmbrella",
                unavailable: "门边已经没有留下那把旧伞",
                effect: {
                  time: 1,
                  flagsOff: ["doorUmbrella"],
                  flagsOn: ["achengClosure", "achengOldUmbrella"],
                  memory: "阿澄接过旧伞，第一次把伞撑开。伞面落下的不是雨，是一整个没有等到的下午。",
                  toast: "阿澄终于带走了那把伞。"
                }
              },
              {
                id: "acheng-final-wait",
                label: "告诉她，还可以再等一会儿",
                detail: "不替她结束等待，也不拿走最后一把伞",
                quote: "“再一会儿。就一会儿。”",
                effect: {
                  time: 1,
                  flagsOn: ["achengStillWaiting"],
                  memory: "阿澄把旧纸角折好，仍旧坐回门边。第一班车来了，她没有起身。",
                  toast: "阿澄继续坐在门边。"
                }
              }
            ]
          },
          {
            id: "shen-final",
            name: "沈伯",
            initial: "沈",
            avatarClass: "shen",
            arrival: "来开最后一班车的人",
            line: "他把旧车队徽章放在柜台上，问阿澄今晚有没有来。第一班车快到了，他还没有决定自己要坐在哪个位置。",
            note: "两罐咖啡里，有一罐已经等了八夜。",
            action: "接待沈伯",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "shen-final-ticket",
                label: "把旧车票交给他，让他去发车",
                detail: "不是末班车，是第一班；这次有人会到站",
                quote: "“好。第一班车，我来开。这回不会有人白等。”",
                requiresStock: { expiredTicket: 1 },
                unavailable: "还没有找到过期车票",
                effect: {
                  time: 1,
                  stock: { expiredTicket: -1 },
                  flagsOn: ["shenClosure", "shenDrives"],
                  memory: "沈伯收下旧车票，走向站外停着的车。他没有回头，但第一次把两罐咖啡都带上了。",
                  toast: "沈伯坐进了第一班车的驾驶座。"
                }
              },
              {
                id: "shen-final-coffee",
                label: "打开留给他的那罐咖啡",
                detail: "让第二罐终于不再替一个没到的人等下去",
                quote: "“他早就到了。是我一直没敢回头。”",
                requiresFlag: "unopenedCoffee",
                unavailable: "第一夜留下的那罐咖啡已经不在了",
                effect: {
                  time: 1,
                  flagsOff: ["unopenedCoffee"],
                  flagsOn: ["shenClosure", "shenSecondCoffee"],
                  memory: "沈伯打开第二罐咖啡。热气升起来的时候，他说那个人其实早就到了，只是自己没敢回头。",
                  toast: "沈伯喝完了第二罐咖啡。"
                }
              },
              {
                id: "shen-final-wait",
                label: "陪他继续等一个不会来的人",
                detail: "让第一班车空着开走，也让他保留最后的等待",
                quote: "“再等一分钟吧。钟走到十一点零一分，我就走。”",
                effect: {
                  time: 1,
                  flagsOn: ["shenStillWaiting"],
                  memory: "第一班车在门外停下，沈伯却没有起身。他说再等一会儿，等钟走到十一点零一分。",
                  toast: "沈伯留在站牌下。"
                }
              },
              {
                id: "shen-final-badge",
                label: "收下旧徽章，让他今天不用再等",
                detail: "不要求旧车票，也不要求最后一罐咖啡",
                quote: "“徽章你收着。今天我不当司机，当乘客。”",
                effect: {
                  time: 1,
                  flagsOn: ["shenClosure", "shenBadgeKept"],
                  memory: "沈伯把旧车队徽章放进你手里。他说第一班车不需要司机，因为今天想坐车的人终于到齐了。",
                  toast: "旧徽章留在了柜台上。"
                }
              }
            ]
          },
          {
            id: "clerk-final",
            name: "0217",
            initial: "零",
            avatarClass: "clerk",
            arrival: "来交还最后一天值班的人",
            line: "她把空工牌放在柜台上，旁边是小满留下的空饭盒。她问自己能不能也有一个不用工作到天亮的明天。",
            note: "编号背后其实一直写着一个名字，只是没有人念过。",
            action: "接待 0217",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "clerk-final-name",
                label: "念出工牌背后的名字",
                detail: "不把她只当作一个替店值班的编号",
                quote: "“原来我叫这个。怪不得每次听见，都想回头。”",
                effect: {
                  time: 1,
                  flagsOn: ["clerkClosure", "clerkNamed"],
                  memory: "你念出工牌背后的名字。0217愣了很久，最后说：“原来我还记得自己被这样叫过。”",
                  toast: "0217把工牌收进了自己的口袋。"
                }
              },
              {
                id: "clerk-final-off",
                label: "告诉她，今天正式下班",
                detail: "不卖东西，也不安排下一件小事",
                quote: "“下班了？那我明天……是不是可以睡到自然醒。”",
                effect: {
                  time: 1,
                  flagsOn: ["clerkClosure", "clerkOffDuty"],
                  memory: "0217摘下工牌，朝门外走去。她第一次不是去补货，也不是去换班。",
                  toast: "0217第一次真正下班。"
                }
              },
              {
                id: "clerk-final-shift",
                label: "让她继续替你看一会儿店",
                detail: "把最后的灯交给她，也把离开留到下一次",
                quote: "“行吧。反正灯我熟。你去歇着，别又把收据弄丢。”",
                effect: {
                  time: 1,
                  flagsOn: ["clerkStillWorking"],
                  memory: "0217把工牌重新戴上。她说没关系，反正自己一直知道怎样把灯留着。",
                  toast: "0217重新站回了柜台后。"
                }
              }
            ]
          },
          {
            id: "xiaoman-final-wave",
            name: "小满",
            initial: "满",
            avatarClass: "xiaoman",
            arrival: "来送最后一份早饭的人",
            line: "她把一只空饭盒推回柜台，说这一次想买给还在路上的自己。",
            note: "她不再问明天有没有太阳，只问今天能不能先吃饭。",
            action: "接待小满",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "xiaoman-final-meal",
                label: "把早饭留给她",
                detail: "卖给她一只保温饭盒，收 ¥18",
                quote: "“那我先吃。明天有没有太阳，等吃完再说。”",
                requiresStock: { lunchbox: 1 },
                unavailable: "货架上的保温饭盒不够",
                effect: {
                  time: 1,
                  stock: { lunchbox: -1 },
                  cash: 18,
                  flagsOn: ["xiaomanClosure", "xiaomanAte"],
                  transaction: { label: "保温饭盒 ×1", amount: 18 },
                  memory: "小满把热饭吃完，才说其实自己一直害怕的不是下雨，而是没有人陪她等晴天。",
                  toast: "小满把最后一口饭留给了自己。"
                }
              },
              {
                id: "xiaoman-final-today",
                label: "告诉她，今天也可以结束",
                detail: "不承诺明天，只承认这一晚已经足够长",
                quote: "“今天结束也可以啊。那我就不硬撑到明天了。”",
                effect: {
                  time: 1,
                  flagsOn: ["xiaomanClosure", "xiaomanToday", "xiaomanFinalToday"],
                  memory: "小满点点头，把空饭盒留在柜台。她说那明天就等明天再说。",
                  toast: "小满把空饭盒留在了店里。"
                }
              },
              {
                id: "xiaoman-final-wait",
                label: "让她继续等更长的明天",
                detail: "把晴天留到下一夜，也把告别继续推迟",
                quote: "“没关系，我等晴天很拿手的。真的。”",
                effect: {
                  time: 1,
                  flagsOn: ["xiaomanStillWaiting"],
                  memory: "小满抱着空饭盒坐回门边。第一班车到站了，她还是先问了明天的天气。",
                  toast: "小满继续等明天的天气。"
                }
              },
              {
                id: "outside-light-xiaoman",
                label: "让她看门外那盏还没有熄的灯",
                detail: "最后一夜，店把灯往门外挪过一次",
                quote: "“那我明天再来，不是因为怕黑。”",
                requiresFlag: "lightOutsideFinal",
                unavailable: "还没有把柜台的灯往门外挪",
                effect: {
                  time: 1,
                  flagsOn: ["xiaomanClosure", "xiaomanToday", "xiaomanFinalLight"],
                  memory: "小满看着门外那盏灯，终于把空饭盒放下。她说，今天有人替她留了灯。",
                  toast: "小满把空饭盒留在了灯下。"
                }
              }
            ]
          }
        ],
        task: {
          id: "setParcel",
          name: "把没有收件人的包裹放上柜台",
          detail: "让它在最后一夜有一个能被看见的位置",
          cost: "不耗时间",
          free: true,
          doneLabel: "包裹已经在柜台上",
          doneDetail: "没有名字，也没有退件地址",
          memory: "你把没有收件人的包裹放到柜台中央。它轻得像一句还没有说完的话。",
          toast: "包裹被放在了柜台中央。",
          flagsOn: ["parcelOnCounter"]
        }
      }
    ],
    routeSix: {
      summer: {
        id: "summer-return-six",
        number: 6,
        place: "倒着走的夏天",
        scope: "第 6 夜 · 倒着走的夏天",
        title: "夏天把最后一班车藏起来了",
        subtitle: "店回到夏天时，太阳已经退到柜台后面。今晚没有人催你打烊，夏天却先开始变短。",
        weather: "晴天 · 下午正在往回收",
        windowTitle: "倒着走的夏天",
        shelf: ["umbrella", "lunchbox", "radio", "glassBottle", "postcard", "scarf"],
        localStock: { glassBottle: 1, postcard: 1 },
        clockStart: "17:40",
        closingTitle: "夏天结束前，留下什么？",
        closingIntro: "夏天没有下一班车。今晚留下的东西，会决定它停在哪个下午。",
        cast: [
          {
            id: "xiaoman-summer-six",
            name: "小满",
            initial: "满",
            avatarClass: "xiaoman",
            arrival: "来还最后一束花的人",
            line: "她抱着一束已经没有香味的花，说夏天快要把下午用完了。",
            note: "她没有问明天有没有太阳，只问今天的灯还能亮多久。",
            action: "接待小满",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "summer-flower-bottle",
                label: "把最后一束花放进玻璃瓶",
                detail: "瓶子少一只，夏天会多停一个下午",
                quote: "“那就让它在这里多待一会儿。”",
                requiresStock: { glassBottle: 1 },
                unavailable: "货架上的玻璃汽水瓶不够",
                effect: {
                  time: 1,
                  stock: { glassBottle: -1 },
                  flagsOn: ["summerFlowerBottle", "xiaomanSummerSix"],
                  memory: "小满把最后一束花插进玻璃瓶。瓶口的风停了，夏天第一次没有往后退。",
                  toast: "柜台上多了一瓶夏天。"
                }
              },
              {
                id: "summer-flower-counter",
                label: "把花留在柜台上",
                detail: "不带走，让明天路过的人还能看见",
                quote: "“留在这里，也算开过。”",
                effect: {
                  time: 1,
                  flagsOn: ["summerFlowerCounter", "xiaomanSummerSix"],
                  memory: "小满把花留在柜台上。她说不用带走，明天路过还能看见。",
                  toast: "最后一束花留在了柜台上。"
                }
              },
              {
                id: "summer-accepted",
                label: "告诉她，夏天已经够长了",
                detail: "不承诺明天，只承认这个下午已经足够",
                quote: "“那我就先把今天过完。”",
                effect: {
                  time: 1,
                  flagsOn: ["summerAccepted", "xiaomanSummerSix"],
                  memory: "小满点点头，把花放下。她第一次没有问明天有没有太阳。",
                  toast: "小满把最后一束花放下了。"
                }
              }
            ]
          },
          {
            id: "acheng-summer-six",
            name: "阿澄",
            initial: "澄",
            avatarClass: "",
            arrival: "来取回红围巾的人",
            line: "她带来一张已经晒褪色的照片，说想把门边那条红围巾带走。",
            note: "夏天一直在后退，她却第一次往前走了一步。",
            action: "接待阿澄",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "summer-scarf-back",
                label: "把红围巾还给她",
                detail: "围巾离开柜台，她带走一个可以收好的下午",
                quote: "“原来有些颜色，带走了也不会褪。”",
                requiresFlag: "roadScarf",
                unavailable: "无名公路上没有留下那条红围巾",
                effect: {
                  time: 1,
                  flagsOff: ["roadScarf"],
                  flagsOn: ["achengSummerScarf", "achengSummerSix"],
                  memory: "阿澄接过红围巾，没有把它围上。她说这次带走的不是等待，是一个可以收好的下午。",
                  toast: "阿澄带走了红围巾。"
                }
              },
              {
                id: "summer-photo-counter",
                label: "让她把照片留在柜台",
                detail: "照片里的伞已经干了，夏天还在慢慢后退",
                quote: "“这张留给你。下次下雨再看。”",
                effect: {
                  time: 1,
                  flagsOn: ["achengSummerPhoto", "achengSummerSix"],
                  memory: "阿澄把照片留在柜台玻璃下。照片里的伞已经干了，夏天还在慢慢后退。",
                  toast: "旧照片留在了柜台玻璃下。"
                }
              },
              {
                id: "summer-sit",
                label: "陪她在夏天里坐一会儿",
                detail: "不看站牌，也不问雨什么时候来",
                quote: "“就坐一会儿。雨还没来。”",
                effect: {
                  time: 1,
                  flagsOn: ["achengSummerRest", "achengSummerSix"],
                  memory: "阿澄在柜台边坐了一会儿，没有看站牌。夏天从她脚边退过去，她没有起身。",
                  toast: "阿澄在柜台边坐了一会儿。"
                }
              }
            ]
          },
          {
            id: "flower-girl",
            name: "卖花的女孩",
            initial: "花",
            avatarClass: "xiaoman",
            arrival: "来换一只瓶子的客人",
            line: "她抱着一束快要谢掉的白色小花，问夏天还能不能把花留在店里。",
            note: "她说小满刚才也在这里，花却一直朝着店里的灯开。",
            action: "接待卖花的女孩",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "flower-bottle",
                label: "用玻璃汽水瓶换她一朵花",
                detail: "瓶子少一只，花会在夏天里多开一晚",
                quote: "“小满说，只要有人看见，花就不算白开。”",
                requiresStock: { glassBottle: 1 },
                unavailable: "货架上的玻璃汽水瓶不够",
                effect: {
                  time: 1,
                  stock: { glassBottle: -1 },
                  flagsOn: ["flowerInBottle", "flowerGirlMet"],
                  memory: "女孩把花插进玻璃瓶。瓶口的风停了，花在倒退的夏天里多开了一晚。",
                  toast: "柜台上多了一瓶白花。"
                }
              },
              {
                id: "flower-counter",
                label: "把花留在柜台上，不收她的钱",
                detail: "花不需要地址，只需要有一个人看见",
                quote: "“那就让它替我在这里待一会儿。”",
                effect: {
                  time: 1,
                  flagsOn: ["flowerOnCounter", "flowerGirlMet"],
                  memory: "女孩把花留在柜台上。她说花不需要地址，只要有一个人看见。",
                  toast: "柜台上留下了一小束白花。"
                }
              },
              {
                id: "flower-refuse",
                label: "告诉她，店里没有能装花的瓶子",
                detail: "不换瓶子，也不留下花",
                quote: "“没关系，花还会再开一次。”",
                effect: {
                  time: 1,
                  flagsOn: ["flowerGirlRefused", "flowerGirlMet"],
                  memory: "女孩抱着花走出门。夏天把她的影子拉得很长。",
                  toast: "卖花的女孩走进了倒退的夏天。"
                }
              }
            ]
          },
          {
            id: "cat-finder",
            name: "找猫的人",
            initial: "猫",
            avatarClass: "traveler",
            arrival: "沿着盐粒走来的人",
            line: "她沿着盐粒一路找来，说猫跑进了夏天最慢的那个下午。",
            note: "她说 0217 提过，只要钟还停着，猫就会回来。",
            action: "帮她找猫",
            cost: "会花掉 1 个营业时间格",
            mode: "special",
            choices: [
              {
                id: "cat-candle",
                label: "把停电蜡烛借给她",
                detail: "蜡烛少一支，夏天里会多一声很轻的猫叫",
                quote: "“0217说它怕黑，也怕我不去找它。”",
                requiresStock: { candle: 1 },
                unavailable: "货架上的停电蜡烛不够",
                effect: {
                  time: 1,
                  stock: { candle: -1 },
                  flagsOn: ["catFound", "catFinderMet"],
                  memory: "她举着蜡烛走进夏天最慢的下午。黑暗里传来一声很轻的猫叫，像有人终于应了她的名字。",
                  toast: "夏天深处传来了一声猫叫。"
                }
              },
              {
                id: "cat-salt",
                label: "把盐撒到钟座下面",
                detail: "盐少一包，猫会沿着这条线回来",
                quote: "“它记得自己走过的路。”",
                requiresStock: { salt: 1 },
                unavailable: "货架上的盐包不够",
                effect: {
                  time: 1,
                  stock: { salt: -1 },
                  flagsOn: ["catTrail", "catFinderMet"],
                  memory: "盐粒在钟座下排成一条细线。她说猫会沿着这条线回来，因为猫记得自己走过的路。",
                  toast: "钟座下多了一条盐粒小路。"
                }
              },
              {
                id: "cat-gone",
                label: "告诉她，猫可能已经先走了",
                detail: "不借蜡烛，也不撒盐",
                quote: "“那我再找一站。它总得在某一站等我。”",
                effect: {
                  time: 1,
                  flagsOn: ["catGone", "catFinderMet"],
                  memory: "她把空猫笼抱在怀里，说那就再找一站。",
                  toast: "找猫的人走向了下一盏灯。"
                }
              }
            ]
          }
        ],
        task: {
          id: "summerSunBottle",
          name: "把最后一段阳光装进玻璃瓶",
          detail: "让一个普通的瓶子收住夏天",
          cost: "1 格",
          doneLabel: "夕阳已经在瓶子里",
          doneDetail: "盖紧以后没有立刻暗下去",
          memory: "你把玻璃瓶举向夕阳。瓶口收住了一小段夏天，盖紧以后没有立刻暗下去。",
          toast: "玻璃瓶里留下了一小段夕阳。",
          flagsOn: ["summerSunBottle"]
        }
      }
    }
  },
  characterArcs: {
    acheng: {
      name: "阿澄",
      initial: "澄",
      role: "雾港公交站的等待者",
      question: "母亲还会不会回来",
      closureFlag: "achengClosure",
      incomplete: "她仍然把伞留在门边，像把一整个下午留在原地。",
      summary: "她把每一把伞都留在门边，像在替母亲保留一个“我还在等”的信号。",
      innerVoice: "“我不是在等车。我只是怕，如果有一天我不在这里，她回来的时候会以为我没有等过。”",
      past: [
        "阿澄十一岁以前住在雾港公交站后面的旧楼里。母亲阿岚在临市的制衣厂上夜班，每周日坐最后一班车回来，手里总拎着一把透明雨伞。阿澄会在站牌下等她，远远看见伞面反光，就知道母亲到了。",
        "十二岁那年，母亲答应她“下一个下雨天就回来”，却从那以后没有再出现。有人说阿岚在临市重新成了家，有人说她出了事，也有人说她只是不想回来。没有一个说法能交给阿澄。",
        "从那以后，阿澄每个下雨的傍晚都来车站。她不再带母亲那把旧伞，而是从店里买最便宜的透明伞，一把一把靠在门边。她告诉自己，只要门边还有伞，母亲回来时就会知道她还在等。",
        "红围巾是母亲离开那天戴的颜色。旧照片里，阿澄还没有学会等末班车。她真正害怕的不是母亲不回来，而是自己等得不够久，才让母亲没有回来。"
      ],
      waiting: "她等的不是末班车，是一个能证明“不是我等得不够久”的答案。",
      keepsake: "透明雨伞是母亲最后一次离开时留下的信号；旧照片里，她还没有学会等末班车；红围巾是母亲离开那天的颜色。",
      voice: "说话短，常把情绪藏在“等”和“伞”里；很少直接说自己害怕。",
      personality: "嘴硬，怕成为别人的负担。她总挑最便宜的伞，却会把伞留给下一个人；被问到母亲时先说“只是顺路”，随后又把伞柄擦了又擦。",
      pastQuotes: [
        "“我不是在等车。我怕她回来时，以为我没有等过。”",
        "“伞放在门边，她远远就能看见。”"
      ],
      connection: "阿澄的伞和沈伯的第二罐咖啡，都在替一个没有回来的人留着位置。",
      toPlayer: "你是第一个没有催她“别再等”的人。",
      letter: "“阿澄，不是因为你等得不够久。是妈妈没有勇气回来。把伞带走，去过会下雨、也会放晴的日子。”",
      lockedHint: "在雾港公交站接待阿澄，才能读到她的前史。"
    },
    shen: {
      name: "沈伯",
      initial: "沈",
      role: "11 路夜班车的最后一位司机",
      question: "没到的人还值不值得等",
      closureFlag: "shenClosure",
      incomplete: "他仍旧替第二罐咖啡留着一个空座位。",
      summary: "他每天买两罐咖啡，一罐给自己，一罐给最后一夜没有回头去接的人。",
      innerVoice: "“我知道她不会来了。可那罐咖啡还没凉，我就还想再坐一会儿。”",
      past: [
        "沈伯开了二十七年雾港的 11 路夜班车。妻子阿琴在终点站的小食堂上夜班，每晚给他留两罐咖啡。一罐让他在路上喝，一罐放在副驾驶，说是“给还没上车的人”。",
        "线路停运前的最后一夜，阿琴站在站台上叫他，说今天想坐他的车一起回家。沈伯那天因为线路取消、乘客抱怨，心里烦，没有回头，只想着把最后一班开完。车开出去以后，他再也没有见过她。",
        "后来阿琴病重，托人把那罐没有打开的咖啡和旧车队徽章送回车队，说“别让他一直等”。沈伯没有听。他每天还是买两罐咖啡，坐在站牌下，等一个他知道不会再来的人。",
        "旧车票、旧徽章、第二罐咖啡，都是他替那一夜保留的证物。他真正等的不是阿琴，是那个没有回头的自己。"
      ],
      waiting: "他想把那晚没有回的头，补回来。",
      keepsake: "第二罐咖啡是没有送出的道歉；旧车队徽章是他开了半辈子的路线；过期车票是线路停运的那一夜。",
      voice: "用时刻、班次和车队行话说话；礼貌，句子完整，偶尔停顿。",
      personality: "把关心说成排班和规矩。他会纠正别人“不是等，是还没到点”，却永远多买一罐咖啡；被人道谢时先移开视线，再低头整理旧制服。",
      pastQuotes: [
        "“第一班车总得有人开。可我那晚没有回头。”",
        "“第二罐咖啡不是给乘客的。”"
      ],
      connection: "他和阿澄都在等一个没有回来的人；一个留伞，一个留咖啡。",
      toPlayer: "你是第一个替他把第二罐咖啡留着的人。",
      letter: "“老沈，我那天就在站台上。你没有回头，我不怪你。咖啡凉了就不要喝了，回家吧。”",
      lockedHint: "在夜班车到站前接待沈伯，才能读到他的前史。"
    },
    clerk: {
      name: "0217",
      realName: "林晚",
      initial: "零",
      role: "被编号盖住名字的夜班店员",
      question: "除了值班，她还能不能有自己的名字",
      closureFlag: "clerkClosure",
      incomplete: "她重新戴上了工牌，继续替看不见的人值班。",
      summary: "她的编号替她活了太久，久到她差点忘了自己叫林晚。",
      innerVoice: "“工牌上写着 0217。看久了，连我自己都差点以为那就是我的名字。”",
      past: [
        "林晚十九岁来到这座城市，第一份工是便利店夜班。后来是加油站、自动售货机仓库、车站临时店员。每一份工都只写编号，0217 就是她在排班表上的全部名字。",
        "她有一个弟弟在老家读书，学费和生活费都由她寄回去。弟弟每次打电话都叫她“姐”，可她总在上班，说不了几句就挂。她攒过很多次“明天休息”，又一次次把休息日换成了加班。",
        "她开始害怕停下来。因为一停下来，她就会发现自己没有一个可以回去的房间，也没有一个会在门口等她的人。工牌、工资单、旧工资币，是她证明自己确实活过、确实工作过的唯一东西。",
        "但她其实一直记得自己叫林晚。只是没有人这样叫过她，她也不敢先替自己叫。"
      ],
      waiting: "她等的不是下班，是一个能叫出她名字的人。",
      keepsake: "工牌是她替别人值班的证明；旧工资币是被磨掉年份的时间；停电蜡烛是她第一次替自己照路。",
      voice: "用排班、编号、零头和下班说话；疲惫，偶尔带一点冷幽默。",
      personality: "对规章制度熟，也对人的疲惫熟。累极了会拿编号说冷笑话；别人叫她“0217”时答应得很快，叫她“林晚”时反而会停半拍。",
      pastQuotes: [
        "“0217叫久了，连我都快忘了自己叫什么。”",
        "“零头不用找了，我想留一点给自己。”"
      ],
      connection: "她和小满都在确认自己会不会被看见；一个等名字，一个等有人陪她等晴天。",
      toPlayer: "你是第一个没有把她只当成 0217 的人。",
      letter: "“姐，我把你的名字写在门牌上了。你不用再寄钱，回家吃饭吧。”",
      lockedHint: "在无眠车站接待 0217，才能读到她的前史。"
    },
    xiaoman: {
      name: "小满",
      initial: "满",
      role: "在门外等晴天的人",
      question: "明天到底会不会放晴",
      closureFlag: "xiaomanClosure",
      incomplete: "她还在门外等一个不会立刻到来的晴天。",
      summary: "她问明天有没有太阳，是因为母亲答应过她“晴天就回来”。",
      innerVoice: "“我只是想问一句明天有没有太阳。有人回答我，就好像明天真的会来。”",
      past: [
        "小满小时候父母分开，她跟着母亲搬过很多次家。每次离开前，母亲都说“等晴天，我们就回来”。她记住了晴天，却总是等不到。",
        "母亲后来去了很远的地方工作，答应她“等夏天的小满一到，就回来陪你吃饭”。可是小满等过了一个又一个小满，只等到一只空饭盒和一句“下次一定”。",
        "她开始一个人带着饭盒来车站。饭盒里有时是给母亲留的饭，有时是给自己的早饭。她总问“明天有没有太阳”，因为她不知道还能问什么。她真正害怕的不是下雨，是没有人愿意陪她把雨等到停。",
        "旧收音机、玻璃瓶、保温饭盒，都是她用来“保存明天”的东西。她需要的不是天气预报，是有人告诉她：今天也可以结束，今天也值得吃饭。"
      ],
      waiting: "她等的不是晴天，是一个不会因为下雨就先走的人。",
      keepsake: "保温饭盒是给还没回来的人留的位置；旧收音机是会说“明天还存在”的声音；玻璃瓶里可以留一个晴天。",
      voice: "用天气、饭和明天说话；轻快，但会突然露出不安。",
      personality: "用天气试探对方会不会留下。饿的时候先问别人吃没吃；失望时会笑着说“没关系”，手却把空饭盒抱得更紧。",
      pastQuotes: [
        "“明天有没有太阳？”",
        "“我不是怕下雨，我是怕没有人陪我等到停。”"
      ],
      connection: "她的饭盒后来装下了 0217 留下的字条；两个等待的人第一次坐到同一张柜台边。",
      toPlayer: "你是第一个先问她今天有没有吃饭的人。",
      letter: "“小满，妈妈没有等到晴天回来。不是你不够乖。以后下雨也要吃饭，晴天也要吃饭。先把今天过完。”",
      lockedHint: "在倒着走的夏天接待小满，才能读到她的前史。"
    },
    traveler: {
      name: "无名旅人",
      initial: "旅",
      role: "把所有人的信送到，却弄丢自己名字的邮差",
      question: "没有名字的人能不能收到一封信",
      closureFlag: "travelerClosure",
      incomplete: "他站回门外，脚下仍旧没有完整的影子。",
      summary: "他替所有人送过信，却把自己的名字弄丢了。",
      innerVoice: "“我送过很多人的信。轮到自己写的时候，才发现收件人那一栏是空的。”",
      past: [
        "无名旅人曾经是雾港邮局的步班邮差。他走了三十年的路，替别人送信、送汇款单、送最后一句话。他熟悉每一条巷子，却从来没有一个需要他回去的地址。",
        "线路撤销前，他把五封没有送到的信收进一只纸箱：阿澄母亲的信、阿琴写给沈伯的信、弟弟写给林晚的信、小满母亲的信，还有一封没有署名的信，收件人写的是“还在路上的人”。",
        "那封没有署名的信，其实是他写给自己的。他想在退休那天写上自己的名字，却发现自己已经想不起来。他把纸箱留在世界尽头的便利店，假装它是别人的包裹。",
        "他一直在路上，是因为他怕停下来以后，没有人会记得他。可他也知道，只有停下来，别人才有机会叫出他的名字。"
      ],
      waiting: "他等的不是地址，是一个愿意写下他名字的人。",
      keepsake: "空白明信片是他留给自己的最后一个收件人位置；玻璃瓶里的“我到了”是他一直没有说出口的抵达；过期车票是他走过却回不去的路线。",
      voice: "用地址、收件人和名字说话；像在找词，句子常带着不确定。",
      personality: "礼貌得像在念地址，记得每条路，却记不得自己的名字。被认真对待时先说“不用记我”，走出去以后又会悄悄回头确认你还在看。",
      pastQuotes: [
        "“我送过所有人的信。轮到自己，收件人那一栏是空的。”",
        "“我到了。只是没有人听见。”"
      ],
      connection: "五封信都是他送出的；他把五个互不相识的人带到同一间店，也把自己弄丢了。",
      toPlayer: "你是第一个愿意替包裹找收件人的人。",
      letter: "“如果你看见这封信，请替我写一个名字。随便什么名字都行，只要是你记得的。”",
      lockedHint: "在无名公路接待无名旅人，才能读到他的前史。"
    }
  },
  achievements: [
    { id: "first-night", name: "雨还没有停", description: "完成第一夜，拿到第一张收据。" },
    { id: "first-trade", name: "第一笔交易", description: "在柜台前完成一次接待或即时交易。" },
    { id: "first-gift", name: "不收钱", description: "把一件商品送给客人。" },
    { id: "first-restock", name: "补货员", description: "从货架或柜台补进一件商品。" },
    { id: "station-route", name: "无眠车站", description: "第一夜后选择前往无眠车站。" },
    { id: "summer-route", name: "倒着走的夏天", description: "第一夜后选择前往倒着走的夏天。" },
    { id: "all-arcs", name: "五个答案", description: "完成五条人物支线。" },
    { id: "all-pasts", name: "同一班车", description: "进入五个人的过去。" },
    { id: "opened-parcel", name: "拆信的人", description: "在最后一夜拆开没有收件人的包裹。" },
    { id: "sealed-parcel", name: "封存的人", description: "在最后一夜重新封好包裹，让它继续上路。" }
  ],
  closingMemories: {
    umbrella: "打烊时，你把阿澄的伞收回门内。伞柄还是暖的。",
    coffee: "你收好沈伯没打开的咖啡，在罐底写了“明晚”。",
    lunchbox: "保温饭盒留在柜台最亮的位置，像在等一句没有说完的话。",
    coin: "你把 0217 的旧工资币压在收银盒下面。它的年份已经磨掉了。",
    photo: "你把旧照片留在柜台玻璃下。照片里的雨还没有停。",
    scarf: "你把阿澄戴过的红围巾折好。无名公路的风还留在里面。",
    postcard: "你收好无名旅人的明信片。字已经消失，收件人的名字还在。",
    bottle: "你把玻璃瓶盖紧，里面那句“我到了”终于没有散掉。",
    badge: "你把 0217 的旧工牌收进收银盒。数字背面写着她的名字。",
    ticket: "你把被火光照过的旧车票夹进记忆册。背面只剩一个站名。",
    brokenUmbrella: "你把断骨的伞留在门边。它撑不开，却替一个还没回来的人占着位置。",
    flower: "你把白花留在柜台上。没有地址的花，也在灯下多开了一晚。",
    catTrail: "你没有扫掉钟座下的盐粒。也许下一只没有影子的猫会沿着它回来。",
    summerBottle: "你把装着夕阳的玻璃瓶留在柜台上。夏天在瓶口停了一小会儿。",
    summerFlower: "你把最后一束花留在瓶里。花没有地址，却在灯下多开了一晚。",
    summerScarf: "你把红围巾折好，留在柜台。夏天从围巾边上慢慢退了过去。",
    receipt: "今晚的收据被夹进记忆册，字迹已经开始变淡。",
    nothing: "你没有留下特别的东西。门上的灯一盏一盏暗了。",
    openParcel: "你拆开没有收件人的包裹，让五页信第一次一起被柜台上的灯照见。谁愿意接过自己的那一页，就由谁亲手收下。",
    sealParcel: "你把没有收件人的包裹重新封好，决定让它在下一段夜路里继续等一个名字。"
  },
  partialOpenParcel: {
    title: "拆开包裹之后 · 只读完一部分",
    text: "包裹里是五张没有寄出的旧信。第一班车到站前，只有几页被真正读了出来。读到的人各自带着自己的答案走向车门；还没读到的人仍留在店里，守着自己的等待。包裹没有因此变轻，但至少有几句话不再压在黑暗里。"
  },
  partialOpenParcelNone: {
    title: "拆开包裹之后 · 还没有人读信",
    text: "包裹里是五张没有寄出的旧信。第一班车到站前，没有一页被真正读出来。五个人仍旧留在店里，各自守着自己的等待。包裹被打开了，却还没有人准备好接过自己的那一页。"
  },
  characterEndingVariants: {
    acheng: [
      {
        requiresFlags: ["achengClosure", "parcelOpenedForAcheng"],
        title: "阿澄 · 把伞留给下一场雨",
        text: "阿澄把母亲留下的那一页折好，收进口袋。透明雨伞留在门边，她走到车门前，回头看了一眼，说下次下雨时，谁需要就让谁拿去。伞还在，她却不必再替它守着那个下午。"
      },
      {
        requiresFlags: ["achengClosure", "achengOldUmbrella"],
        title: "阿澄 · 把伞带走",
        text: "阿澄把接回的旧伞撑开，又轻轻合上。这次她没有把它放回门边，而是握着伞柄走向第一班车。她说，伞可以带走，等过的那个下午也可以好好收起来。"
      },
      {
        excludesFlags: ["achengClosure", "achengStillWaiting"],
        title: "阿澄 · 还没听完的话",
        text: "第一班车的灯照到门边，阿澄还在那里。你没来得及听完她这一夜的话，也没有替她说出告别。属于她的那句回答，留给下一次相遇。"
      }
    ],
    shen: [
      {
        requiresFlags: ["shenClosure", "shenDrives"],
        title: "沈伯 · 第一班车，我来开",
        text: "沈伯收好你交给他的旧车票，走向第一班车的驾驶座。两罐咖啡都跟着他上了车。他把后视镜调了调，认真数过门边的人，才说这一次，不会让谁白等。"
      },
      {
        requiresFlags: ["shenClosure", "shenSecondCoffee"],
        title: "沈伯 · 第二罐终于打开了",
        text: "沈伯把第二罐咖啡喝完，空罐在柜台上并排放着。他不再替一个没有到的人守着热气，也没有再问末班车几点来。第一班车亮灯时，他起身走了过去，脚步比往常慢，却没有停在站牌下。"
      },
      {
        requiresFlags: ["shenClosure", "shenBadgeKept"],
        title: "沈伯 · 今天当乘客",
        text: "旧车队徽章留在你的手心里。沈伯上车以后，没有走向驾驶座，只在靠窗的位置坐下。他摸了摸空下来的衣襟，朝你点点头，说今天不用替谁发车，坐一趟就好。"
      },
      {
        excludesFlags: ["shenClosure", "shenStillWaiting"],
        title: "沈伯 · 还没问完的班次",
        text: "沈伯站在站牌下，看着第一班车的灯。你还没有听到他这一夜最后的选择，也不知道他会坐进车里，还是再等一分钟。柜台给他留着位置。"
      }
    ],
    clerk: [
      {
        requiresFlags: ["clerkClosure", "clerkNamed"],
        title: "林晚 · 名字被叫住了",
        text: "你叫出林晚的名字时，她回过了头。工牌被她收进口袋，没有再翻回写着编号的那一面。走出店门前，她说以后要是再来，就叫这个名字吧，她听得见。"
      },
      {
        requiresFlags: ["clerkClosure", "clerkOffDuty"],
        title: "0217 · 今天正式下班",
        text: "0217把工牌摘下来，没有问下一班几点开始。她在门口站了一会儿，像在练习一个不需要交接的离开。最后她说，明天想睡到自然醒，然后慢慢走进天亮的地方。"
      },
      {
        excludesFlags: ["clerkClosure", "clerkStillWorking"],
        title: "0217 · 没有交接的这一夜",
        text: "柜台后的灯还亮着。0217把工牌握在手里，等着一句还没有说完的交接。你没有听到她最后的决定，便先收起了这一夜。她的名字还在工牌背面，等下一次被看见。"
      }
    ],
    xiaoman: [
      {
        requiresFlags: ["xiaomanClosure", "xiaomanAte"],
        title: "小满 · 先把今天的饭吃完",
        text: "小满吃完热饭，把空饭盒留在柜台上。她说，明天有没有太阳，等明天再问。走到门口时，她没有回头确认天气，只拍了拍已经暖起来的胃。"
      },
      {
        requiresFlags: ["xiaomanClosure", "xiaomanFinalLight"],
        title: "小满 · 明天再来看灯",
        text: "小满看了一会儿门外的灯，把空饭盒放在灯下。她说，明天也许还会来，不过这次不是因为怕黑。说完她就走了，没有把这一晚拖成另一个等不到的晴天。"
      },
      {
        requiresFlags: ["xiaomanClosure", "xiaomanToday"],
        title: "小满 · 今天已经够了",
        text: "小满把空饭盒轻轻放下，认真点了点头。今天可以结束，明天就等明天再说。她走进门外那片很慢的光里，影子终于和脚步一起移动。"
      },
      {
        excludesFlags: ["xiaomanClosure", "xiaomanStillWaiting"],
        title: "小满 · 还没回答的今天",
        text: "小满抱着饭盒，站在灯照得到的地方。你还没有听完她这一夜想说的话，也没有回答她今天能不能先歇一歇。门外的天色慢慢亮起来，柜台还给她留着位置。"
      }
    ],
    traveler: [
      {
        requiresFlags: ["travelerClosure", "parcelNamed"],
        title: "无名旅人 · 名字终于留下",
        text: "无名旅人又看了一眼明信片上的名字。字迹没有消失，他的影子也完整地落在柜台上。他没有急着把包裹抱走，只把写着名字的那面朝向灯，像确认自己终于也能收到一封信。"
      },
      {
        requiresFlags: ["travelerClosure", "parcelAddress"],
        title: "无名旅人 · 一个可以抵达的地址",
        text: "无名旅人把那张过期车票压在包裹边，指了指上面早已停运的站名。名字还没想起来，他却终于承认自己到过这里。第一班车亮灯时，他没有再退回门外。"
      },
      {
        requiresFlags: ["travelerClosure"],
        excludesFlags: ["parcelNamed", "parcelAddress"],
        title: "无名旅人 · 今夜先坐一会儿",
        text: "无名旅人坐在柜台边，怀里的包裹慢慢放低了。他没有写下名字，也没有补上地址，只在灯下安静地歇到天亮。这一次，你没有催他出发，他也没有再说自己只是路过。"
      },
      {
        excludesFlags: ["travelerClosure"],
        title: "无名旅人 · 还没有写下的地址",
        text: "无名旅人还在门边，包裹上仍有一栏空着。你没有听到他最后想写的那个名字，也没有替他填上。第一班车照进来的光越过门槛，他仍在能看见柜台的地方。"
      }
    ]
  },
  finale: {
    opening: [
      "第一班车的前灯从雾里照进来。门边、站牌下和柜台上的影子同时亮了一下，五个人又到了该告别的时候。",
      "没有收件人的包裹就在店里。里面的五页旧信，有人已经接过，有人还没有准备好。你把手放在封口上，记起刚才留在柜台前的那些话。"
    ],
    characters: {
      acheng: {
        resolved: {
          title: "阿澄 · 把伞带走",
          text: "阿澄读完母亲留下的那一页，把透明雨伞撑开，又合上。她没有把伞留在门边，而是带着它走向第一班车。她说，这一次不是不等了，是终于知道等待可以结束。"
        },
        unresolved: {
          title: "阿澄 · 还会再等一会儿",
          text: "阿澄把旧纸角折好，坐回门边。第一班车到站时，她没有起身，只把伞往门边挪了挪。她还在等，但这一次她知道自己在等什么。"
        }
      },
      shen: {
        resolved: {
          title: "沈伯 · 把车开走",
          text: "沈伯打开第二罐咖啡，热气升起来，模糊了他胸前的旧徽章。他没有再问末班车几点到，只把两罐咖啡都放进车里，坐进第一班车的驾驶座。"
        },
        unresolved: {
          title: "沈伯 · 再等一分钟",
          text: "沈伯把旧徽章放在柜台上，仍旧站在站牌下。他说再等一分钟，等钟走到十一点零一分。第一班车开走时，他没有回头。"
        }
      },
      clerk: {
        resolved: {
          title: "0217 · 第一次下班",
          text: "0217听见有人叫出工牌背后的名字，愣了很久。她把工牌摘下来，第一次没有换成下一班的值班表。她走向门外，脚步很慢，但不再像去上班。"
        },
        unresolved: {
          title: "0217 · 继续留灯",
          text: "0217把工牌重新戴好，替你把最后一盏灯留着。她说没关系，反正自己一直知道怎样把灯留着。第一班车经过时，她还在柜台后。"
        }
      },
      xiaoman: {
        resolved: {
          title: "小满 · 今天已经够了",
          text: "小满把最后一口饭吃完，把空饭盒留在柜台上。她没有再问明天有没有太阳，只说今天已经够了。她走进门外那片很慢的光里，影子终于和脚步一起移动。"
        },
        unresolved: {
          title: "小满 · 先问明天",
          text: "小满抱着空饭盒坐回门边，还是先问了明天的天气。第一班车到站了，她没有上车，只把饭盒盖好，像替一个还没到的晴天留着位置。"
        }
      },
      traveler: {
        resolved: {
          title: "无名旅人 · 终于有名字",
          text: "无名旅人在明信片上写下自己的名字。字迹没有消失，他的影子也第一次完整地落在柜台上。他把包裹交给第一班车，像把一段走了太久的地址终于寄出去。"
        },
        unresolved: {
          title: "无名旅人 · 下一站再写",
          text: "无名旅人抱着包裹站在门外，脚下仍旧没有完整的影子。他没有写下名字，只说下一站也许会有。第一班车开走时，他还站在能看见灯的地方。"
        }
      }
    },
    overall: {
      openParcel: {
        full: {
          title: "拆开包裹之后 · 五个答案",
          text: "五个人都在柜台前给出了自己的回答。有人接过信，有人收好了自己的东西，也有人终于愿意坐下来歇一会儿。你把包裹打开，让还在里面的页也见一见灯。第一班车开走以后，店门没有关，柜台还给下一个人留着位置。"
        },
        partial: {
          title: "拆开包裹之后 · 还没说完的话",
          text: "有人已经给出自己的回答，也有人还想再等一会儿。你打开包裹，把还没交出的信摊在灯下。店没有替任何人补写告别，也没有把没说完的话收走。第一班车开走时，柜台上的灯亮着，门口还留着位置。"
        },
        none: {
          title: "拆开包裹之后 · 还没有人读信",
          text: "包裹被打开了，却没有人接过自己的那一页。五个人仍旧留在店里，各自守着自己的等待。店没有催他们，只把五页信摊在柜台上，让它们第一次被灯照到。第一班车开走时，没有人上车，但也没有人再假装自己没有在等。"
        }
      },
      sealParcel: {
        title: "封存包裹之后",
        text: "你把包裹重新封好。五个人仍旧留在各自的位置上：阿澄在门边，沈伯在站牌下，0217在柜台后，小满在门外，无名旅人没有完整的影子。第一班车开过去，店带着包裹继续上路。下一段夜路里，他们还会再遇见——也许下一次，有人会先拆开它。"
      },
      sealParcelPartial: {
        title: "封存包裹之后 · 先收好这一夜",
        text: "有人已经给出自己的回答，也有人仍留在等待里。你没有把已经说过的话收回，只把包裹重新封好。走的人可以走，想再坐一会儿的人也有位置，店带着没说完的部分继续上路。"
      },
      sealParcelFull: {
        title: "封存包裹之后 · 所有答案都已抵达",
        text: "五个人都已经给出自己的回答，封口不再替他们决定去留。你把包裹重新收好，也记住了有人带走东西、有人留下东西、有人终于肯歇脚的这一夜。第一班车开走以后，店继续上路，门上的灯还亮着。"
      }
    },
    closing: "门上的灯一盏一盏暗下去。店又向前走了一夜。"
  },
  endings: {
    station: {
      openParcel: {
        title: "拆开包裹之后",
        text: "包裹里是五张没有寄出的旧信。阿澄读完母亲留下的那一页，把伞撑开放进第一班车；沈伯终于喝掉第二罐咖啡，坐进驾驶座；0217念出了自己的名字；小满把早饭吃完；无名旅人在明信片上写下收件人。五个人不是血亲，却在同一个夜里选择成为彼此的家人。店第一次不再漂移。"
      },
      sealParcel: {
        title: "封存包裹之后",
        text: "你没有拆开包裹。第一班车到站又离开，五个人仍旧站在各自的位置：阿澄守着一把伞，沈伯替空座位留着咖啡，0217重新戴上工牌，小满继续问明天的天气，无名旅人还是没有名字。店带着包裹驶向下一段夜路，像把同一场等待延长到永远。"
      }
    },
    summer: {
      openParcel: {
        title: "拆开包裹之后",
        text: "包裹里是五张没有寄出的旧信。阿澄读完后把旧伞带走，沈伯决定不再发一班空车，0217把工牌翻到写着名字的一面，小满吃完了饭盒里的最后一口，无名旅人在明信片上签下自己的名字。五个人不是血亲，却在这一夜选择成为彼此的家人。倒着走的夏天第一次朝明天前进。"
      },
      sealParcel: {
        title: "封存包裹之后",
        text: "你没有拆开包裹。太阳停在地平线上，阿澄仍在门边等伞，沈伯仍握着旧车票，0217继续整理货架，小满把饭盒留到更远的明天，无名旅人站回没有影子的门边。店带着包裹走进下一轮倒退的夏天，所有人都还来得及说再见，却没有人真正离开。"
      }
    }
  }
};
