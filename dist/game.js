// 《天亮前交出去》成品（由 scripts/build.js 產生，請不要手改；改 game/、content/ 後重跑 npm run build）
// source-hash: 6208c550b4e6d21ee3407aa1339ccde5763e5949f14613f430167db715437372
(function () {
'use strict';
const __RAW_CONTENT = {"puzzles":{"puzzles":[{"id":"p1","order":1,"title":"筆電密碼鎖","room":"r401","object":"laptop","requires":[],"stages":[{"id":"lock","type":"code","prompt":"筆電要輸入 4 位數密碼。","answer":"5861","maxWrong":3,"wrongDeath":"d_p1_lockout","wrongMessage":"密碼錯誤。","successMessage":"解鎖了。"},{"id":"update","type":"choice","prompt":"Windows：更新已準備就緒。","options":[{"id":"later","label":"稍後提醒我","outcome":"death","death":"d_p1_later"},{"id":"now","label":"立即重新啟動","outcome":"death","death":"d_p1_restart"},{"id":"schedule","label":"排定時間（08:00 之後）","outcome":"next","message":"更新排到早上 8 點以後了。"}]},{"id":"find","type":"choice","prompt":"雲端那份被刪了，報告還能去哪找？","options":[{"id":"autorecover","label":"開 Word，點最上面那個自動修復檔","outcome":"death","death":"d_p1_autorecover"},{"id":"history","label":"看雲端的版本紀錄","outcome":"next","message":"紀錄寫著：最新那份最後在阿哲的筆電上編輯，23:40。阿哲的 IG 限動打卡在 503 研究室。"}]}],"reward":{"items":[],"flags":["know_503"]}},{"id":"p2","order":2,"title":"講桌漢字滾輪鎖","room":"r401","object":"lectern","requires":["p1"],"stages":[{"id":"wheel","type":"wheel","prompt":"講桌抽屜有 4 個漢字滾輪。","wheels":[["準","遲","早","補"],["時","交","到","考"],["不","必","可","要"],["收","扣","改","交"]],"answer":["遲","交","不","收"],"wrongMessage":"抽屜沒動。","successMessage":"抽屜打開了，裡面有一支鑰匙和一張公告。"},{"id":"drawer","type":"choice","prompt":"抽屜裡有一張公告：「期中報告延期一週。」右下角的小字：公告日期 去年 11/3。","options":[{"id":"rest","label":"太好了，坐下來休息一下","outcome":"death","death":"d_p2_lastyear"},{"id":"take","label":"拿鑰匙就走","outcome":"next","message":"拿到後門鑰匙。"}]}],"reward":{"items":["key_backdoor"],"flags":[]}},{"id":"p3","order":3,"title":"走廊電燈開關","room":"hall","object":"switch_panel","requires":["p2"],"stages":[{"id":"switches","type":"toggles","prompt":"01:00 以後走廊燈只剩一段亮著。面板上有 6 個開關，標籤都磨掉了。","switches":["1","2","3","4","5","6"],"answer":["2","3","5"],"wrongMessage":"去茶水間的那段路還是黑的。","successMessage":"往茶水間的路亮了。"},{"id":"phone","type":"choice","prompt":"手機響了，是媽媽。","options":[{"id":"answer","label":"接起來","outcome":"death","death":"d_p3_mom"},{"id":"text","label":"傳「晚點回妳」","outcome":"next","message":"媽媽回了一個讚。"}]}],"reward":{"items":[],"flags":["hall_lit"]}},{"id":"p4","order":4,"title":"販賣機按鍵","room":"pantry","object":"vending","requires":["p3"],"stages":[{"id":"buttons","type":"sequence","prompt":"販賣機有 4 顆按鈕。","buttons":[{"id":"coffee","label":"咖啡"},{"id":"tea","label":"紅茶"},{"id":"soy","label":"豆漿"},{"id":"energy","label":"能量飲"}],"answer":["coffee","coffee","tea","energy"],"wrongMessage":"販賣機沒反應。","successMessage":"喀啦一聲，退幣口掉出一串鑰匙。"},{"id":"sofa","type":"choice","prompt":"鑰匙拿到了。旁邊的沙發看起來很好睡。","options":[{"id":"nap","label":"設 15 分鐘鬧鐘，瞇一下","outcome":"death","death":"d_p4_nap"},{"id":"go","label":"拿了就走","outcome":"next","message":"拿到 503 的鑰匙。"}]}],"reward":{"items":["key_503"],"flags":[]}},{"id":"p5","order":5,"title":"依序抽書","room":"r503","object":"bookshelf","requires":["p4"],"stages":[{"id":"books","type":"sequence","prompt":"阿哲的筆電沒電了。書架上有 6 本書。","buttons":[{"id":"algo","label":"演算法（第三版）"},{"id":"os","label":"作業系統"},{"id":"db","label":"資料庫系統"},{"id":"net","label":"計算機網路"},{"id":"calc","label":"微積分"},{"id":"stat","label":"統計學"}],"answer":["algo","os","db","net"],"wrongMessage":"書架沒動靜。","successMessage":"書架後面掉出一條充電器。筆電開機了。"},{"id":"azhe","type":"choice","prompt":"阿哲迷迷糊糊醒來：「我幫你整理一下資料夾……」","options":[{"id":"yes","label":"好啊，謝謝","outcome":"death","death":"d_p5_tidy"},{"id":"no","label":"不用啦，你繼續睡","outcome":"next","message":"阿哲又睡著了。"}]},{"id":"file","type":"choice","prompt":"桌面上有三個檔案，要複製哪一個？","options":[{"id":"final","label":"最終版.docx","desc":"修改時間 22:10","outcome":"death","death":"d_p5_final"},{"id":"really","label":"最終版_真的最終.docx","desc":"修改時間 21:55","outcome":"death","death":"d_p5_really"},{"id":"final1","label":"最終版(1).docx","desc":"修改時間 23:40","outcome":"next","message":"報告複製到隨身碟了。"}]}],"reward":{"items":["usb_report"],"flags":[]}},{"id":"p6","order":6,"title":"系辦數字鍵盤","room":"office","object":"keypad","requires":["p5"],"stages":[{"id":"keypad","type":"code","prompt":"系辦門口的門禁鍵盤，4 位數。","answer":"1987","wrongMessage":"嗶——錯誤。","successMessage":"門開了。"},{"id":"router","type":"choice","prompt":"路由器的燈全滅了。","options":[{"id":"reboot","label":"拔掉電源再插回去","outcome":"next","message":"網路回來了。鑰匙箱裡有一串寫著「一樓」的鑰匙。"}]},{"id":"whiteboard","type":"choice","prompt":"白板寫著：「明天迎新物資誰能幫忙搬？」","options":[{"id":"plusone","label":"寫上 +1","outcome":"death","death":"d_p6_plusone"},{"id":"ignore","label":"假裝沒看到","outcome":"next","message":"拿到一樓的鑰匙。"}]}],"reward":{"items":["key_floor1"],"flags":["network"]}},{"id":"p7","order":7,"title":"Moodle 交件","room":"lab","object":"lab_pc","requires":["p6"],"optional":true,"stages":[{"id":"submit","type":"choice","prompt":"期中報告繳交區。檔案選好了。","options":[{"id":"submit","label":"繳交","outcome":"next","message":"頁面重新整理。右上角變成「您正使用訪客身分瀏覽（登入）」。"}]},{"id":"guest_dialog","type":"choice","prompt":"確認：訪客無法存取用戶個人資料表。以完整的用戶帳號登入才能繼續。","options":[{"id":"continue","label":"繼續","outcome":"next"},{"id":"cancel","label":"取消","outcome":"stay","message":"你又回到繳交區，右上角還是訪客。"}]},{"id":"login_choice","type":"choice","prompt":"登入頁。帳號和密碼已經自動填好了。","options":[{"id":"guest","label":"以訪客身分登入","outcome":"death","death":"d_p7_guest"},{"id":"forgot","label":"忘記帳號或密碼嗎？","outcome":"death","death":"d_p7_forgot"},{"id":"contact","label":"保持聯繫：寫信給管理者","outcome":"death","death":"d_p7_admin"},{"id":"autofill","label":"直接按「登入」","outcome":"death","death":"d_p7_senior_account"},{"id":"clear","label":"清掉欄位，自己輸入","outcome":"next"}]},{"id":"login","type":"code","prompt":"輸入你的密碼。（你所有的密碼都設成同一組。）","answer":"5861","checks":[{"id":"remember","label":"記住帳號","setsFlag":"p7_remembered"}],"wrongMessage":"帳號或密碼錯誤。","successMessage":"登入成功。你被丟回了首頁。"},{"id":"find_course","type":"choice","prompt":"首頁的「我的課程」：","options":[{"id":"lastyear","label":"軟體工程導論（去年）","desc":"最近瀏覽","outcome":"death","death":"d_p7_lastyear"},{"id":"calendar","label":"左側欄「行事曆」：期中報告截止 07:00","outcome":"next","message":"從行事曆點回今年的課程了。"},{"id":"thisyear","label":"軟體工程導論（今年）","outcome":"next","message":"找到今年的課程了。"}]},{"id":"final_submit","type":"choice","prompt":"組員傳來：「結論寫好了！在共用檔！」共用檔顯示：字數 4。","options":[{"id":"merge","label":"把共用檔的結論併進來再交","outcome":"death","death":"d_p7_conclusion"},{"id":"submit","label":"直接提交作業","outcome":"next","message":"繳交狀態：已繳交。"}]}],"reward":{"items":[],"flags":["submitted"]}},{"id":"p8","order":8,"title":"廣播控制台","room":"floor1","object":"broadcast","requires":["p6"],"onSolve":"exit","stages":[{"id":"console","type":"select","prompt":"廣播控制台。警衛伯伯抱著鐵捲門遙控器睡在警衛室。","fields":[{"id":"channel","label":"頻道","options":[{"id":"all","label":"全館"},{"id":"f1","label":"一樓"},{"id":"f5","label":"五樓"}]},{"id":"sound","label":"音效","options":[{"id":"bell","label":"上課鐘"},{"id":"breakfast","label":"早餐店：大冰奶好了"},{"id":"fire","label":"消防演練"}]},{"id":"volume","label":"音量","options":[{"id":"low","label":"小"},{"id":"mid","label":"中"},{"id":"max","label":"最大"}]}],"answer":{"channel":"f1","sound":"breakfast","volume":"low"},"deathRules":[{"match":{"channel":"all","volume":"max"},"death":"d_p8_wakeall"}],"wrongMessage":"伯伯翻了個身，繼續睡。","successMessage":"伯伯迷迷糊糊起身，打開鐵捲門，走去早餐店了。"},{"id":"senior","type":"choice","prompt":"走出鐵捲門，學長迎面走來：「欸學弟，吃個飯而已啦。」","options":[{"id":"yes","label":"好啊","outcome":"death","death":"d_p8_dinner"},{"id":"later","label":"下次一定","outcome":"next"}]}],"reward":{"items":[],"flags":["escaped"]}}]},"deaths":{"deaths":[{"id":"d_door","no":1,"origin":"r401","title":"門其實沒鎖","action":"開局還沒碰筆電，就直接推門回家","text":"門其實沒鎖。你走到校門口才想起報告還沒交，又默默走了回來。","tip":"先看看筆電吧。","omen":null,"art":"end_door"},{"id":"d_p1_lockout","no":2,"origin":"p1","title":"密碼打錯三次","action":"筆電密碼連續打錯三次","text":"電腦鎖定 30 分鐘，系館已經先把你鎖定了。","tip":"考卷上有分數，也有日期。","omen":null,"art":"death_lockout"},{"id":"d_p1_later","no":3,"origin":"p1","title":"稍後提醒我","action":"更新視窗按「稍後提醒我」","text":"它真的稍後提醒你了，就在你上台報告的時候。","tip":"排個時間，排到交完以後。","omen":null,"art":"death_update_later"},{"id":"d_p1_restart","no":4,"origin":"p1","title":"立即重新啟動","action":"更新視窗按「立即重新啟動」","text":"正在更新 1/138，天亮見。","tip":"現在更新，就是天亮才能用。","omen":null,"art":"death_update_now"},{"id":"d_p1_autorecover","no":5,"origin":"p1","title":"自動修復","action":"開 Word 點最上面那個自動修復檔","text":"修復成功，幫你修回上週的人生。","tip":"雲端有版本紀錄。","omen":null,"art":"death_autorecover"},{"id":"d_p2_lastyear","no":6,"origin":"p2","title":"延期公告","action":"看到延期公告，安心坐下來休息","text":"你安心坐下，醒來天已經亮了。那張公告是去年的。","tip":"看一下公告的日期。","omen":"公告上印著去年的日期。","art":"death_lastyear_notice"},{"id":"d_p3_mom","no":7,"origin":"p3","title":"媽媽來電","action":"半夜接起媽媽的電話","text":"媽媽問你最近怎樣。你說還好，你們聊到了四點。","tip":"傳個訊息就好。","omen":null,"art":"death_mom_call"},{"id":"d_p4_nap","no":8,"origin":"p4","title":"瞇 15 分鐘","action":"在茶水間沙發設 15 分鐘鬧鐘瞇一下","text":"你設了 15 分鐘的鬧鐘，醒來剩 15 分鐘。","tip":"這張沙發不能坐。","omen":null,"art":"death_nap"},{"id":"d_p5_tidy","no":9,"origin":"p5","title":"幫你整理","action":"讓剛睡醒的阿哲幫你整理資料夾","text":"整理完了，報告也一起被整理掉了。","tip":"讓他繼續睡。","omen":null,"art":"death_tidy"},{"id":"d_p5_final","no":10,"origin":"p5","title":"最終版","action":"複製「最終版.docx」","text":"真正的最終版，叫「最終版(1)」。","tip":"比一下修改時間。","omen":null,"art":"death_final"},{"id":"d_p5_really","no":11,"origin":"p5","title":"真的最終","action":"複製「最終版_真的最終.docx」","text":"交出去才發現是上一個版本。","tip":"比一下修改時間。","omen":null,"art":"death_really_final"},{"id":"d_p6_plusone","no":12,"origin":"p6","title":"+1","action":"在系辦白板的搬物資徵求寫上 +1","text":"你搬完整間社辦，順便被選成器材長。","tip":"有些白板不用回。","omen":null,"art":"death_plusone"},{"id":"d_p7_guest","no":13,"origin":"p7","title":"以訪客身分登入","action":"在登入頁按「以訪客身分登入」","text":"訪客可以看，不能交。你看著截止時間到了。","tip":"要用自己的帳號。","omen":null,"art":"death_guest"},{"id":"d_p7_forgot","no":14,"origin":"p7","title":"忘記密碼","action":"按「忘記帳號或密碼嗎？」","text":"重設信寄到你大一填的 Yahoo 信箱。","tip":"你的密碼，你其實記得。","omen":null,"art":"death_forgot"},{"id":"d_p7_admin","no":15,"origin":"p7","title":"保持聯繫","action":"寫信給 Moodle 管理者","text":"管理者回信了，在三個工作天後。","tip":"靠自己比較快。","omen":null,"art":"death_admin_mail"},{"id":"d_p7_senior_account","no":16,"origin":"p7","title":"記住帳號","action":"公用電腦上直接按「登入」","text":"你成功登入了，是學長的帳號。你幫他交了期中報告。","tip":"公用電腦會記住上一個人。","omen":null,"art":"death_senior_account"},{"id":"d_p7_lastyear","no":17,"origin":"p7","title":"去年的課","action":"點首頁最上面的「軟體工程導論（去年）」","text":"你交給了去年的自己。去年的你也沒交。","tip":"行事曆會帶你回對的課。","omen":null,"art":"death_lastyear_course"},{"id":"d_p7_conclusion","no":18,"origin":"p7","title":"結論寫好了","action":"把組員共用檔的結論併進報告再交","text":"他只寫了標題，字體還是預設的。","tip":"先看字數。","omen":"共用檔顯示「字數：4」。","art":"death_conclusion"},{"id":"d_p8_wakeall","no":19,"origin":"p8","title":"全館最大聲","action":"廣播選全館頻道、音量最大","text":"你成功叫醒了整個系館，包括系主任。","tip":"只要叫醒一個人。","omen":null,"art":"death_wakeall"},{"id":"d_p8_dinner","no":20,"origin":"p8","title":"吃個飯而已","action":"答應學長「吃個飯而已」","text":"恭喜成為下一屆系學會會長。","tip":"下次一定。","omen":"一路上學長的便利貼結尾都簽「有空吃個飯～」。","art":"death_dinner"},{"id":"d_e_desk","no":21,"origin":"r401","title":"先整理桌面","action":"決定先把桌面整理乾淨再開始寫","text":"桌面很乾淨，報告也很乾淨，一個字都沒有。","tip":"","omen":null,"art":"death_desk"},{"id":"d_e_tablet","no":22,"origin":"r401","title":"看一集就好","action":"打開平板，說好只看一集","text":"這部劇有六季。","tip":"","omen":null,"art":"death_tablet"},{"id":"d_e_exam","no":23,"origin":"r401","title":"大概不會考","action":"老師說這章大概不會考，就跳過","text":"那一章占了 40%。","tip":"","omen":null,"art":"death_exam"},{"id":"d_e_timetable","no":24,"origin":"r401","title":"早八不會點名","action":"看著課表決定明天早八先翹","text":"那天點名了，整學期就那一次。","tip":"","omen":null,"art":"death_timetable"},{"id":"d_e_citation","no":25,"origin":"r401","title":"之後再補引用","action":"抄了一句話，出處之後再補","text":"之後的你，完全不記得那句話是哪來的。","tip":"","omen":null,"art":"death_citation"},{"id":"d_e_integrate","no":26,"origin":"r401","title":"我來整合就好","action":"在分工表的「整合」欄寫上自己的名字","text":"你整合了五種字型、三種格式，還有一份沒人寫的結論。","tip":"","omen":null,"art":"death_integrate"},{"id":"d_e_yearbook","no":27,"origin":"hall","title":"幫大家拍照","action":"報名畢業紀念冊的攝影","text":"紀念冊上，你只出現在「攝影」那一欄。","tip":"","omen":null,"art":"death_yearbook"},{"id":"d_e_survey","no":28,"origin":"hall","title":"填個問卷而已","action":"掃布告欄上學長的問卷 QR code","text":"問卷有 87 題，最後一題要你轉發給 30 個人。","tip":"","omen":null,"art":"death_survey"},{"id":"d_e_delivery","no":29,"origin":"pantry","title":"湊免運","action":"叫宵夜外送，多點一樣湊免運","text":"為了省 39 元運費，你多花了 200。","tip":"","omen":null,"art":"death_delivery"},{"id":"d_e_drinks","no":30,"origin":"pantry","title":"第二杯半價","action":"在群組揪宵夜飲料，先幫大家代墊","text":"你墊了 12 杯，收到 8 句「等等轉你」。","tip":"","omen":null,"art":"death_drinks"},{"id":"d_e_labsignup","no":31,"origin":"r503","title":"去實驗室看看","action":"在教授的「有興趣的同學請留名」寫上名字","text":"看看的意思是，碩班讀五年。","tip":"","omen":null,"art":"death_labsignup"},{"id":"d_e_seniorcode","no":32,"origin":"r503","title":"幫看一下就好","action":"幫學長看一下 code，順手修了一個 bug","text":"學長畢業了，你成了它唯一的維護者。","tip":"","omen":null,"art":"death_seniorcode"},{"id":"d_e_format","no":33,"origin":"r503","title":"幫組員改格式","action":"好心幫阿哲把另一份檔案的格式改好","text":"他用舊檔蓋掉了，還說「我剛剛存好了」。","tip":"","omen":null,"art":"death_format"},{"id":"d_e_printer","no":34,"origin":"office","title":"幫忙拉卡紙","action":"好心幫前一個人把卡住的紙拉出來","text":"學長的整本論文開始印了，200 頁。","tip":"","omen":null,"art":"death_printer"},{"id":"d_e_studygroup","no":35,"origin":"office","title":"簽個名而已","action":"在讀書會簽到表簽上名字","text":"你被拉進 12 個群組，每個都在問誰要當窗口。","tip":"","omen":null,"art":"death_studygroup"},{"id":"d_e_restore","no":36,"origin":"lab","title":"存在桌面","action":"用別台電腦寫，存在桌面","text":"電腦還原了，你的報告也還原成不存在。","tip":"","omen":null,"art":"death_restore"},{"id":"d_e_sync","no":37,"origin":"lab","title":"兩台一起開","action":"兩台電腦同時開同一份檔案","text":"雲端幫你留下兩份「衝突的複本」，都只有一半。","tip":"","omen":null,"art":"death_sync"},{"id":"d_e_usbseat","no":38,"origin":"lab","title":"插著隨身碟佔位","action":"插著隨身碟去裝水，先佔個位子","text":"同學好心把隨身碟送去失物招領，招領處早上 9 點才開。","tip":"","omen":null,"art":"death_usbseat"},{"id":"d_e_guardpc","no":39,"origin":"floor1","title":"誰會修電腦","action":"幫警衛伯伯把電腦修好","text":"從此你是整棟系館的 IT，24 小時待命。","tip":"","omen":null,"art":"death_guardpc"},{"id":"d_e_bbq","no":40,"origin":"floor1","title":"有空的寫名字","action":"在系烤報名表的主持人欄寫上名字","text":"恭喜成為系烤主持人。","tip":"","omen":null,"art":"death_bbq"}]},"eggs":{"eggs":[{"id":"e_desk","room":"r401","name":"亂七八糟的桌面","look":"桌上堆滿講義、飲料杯和充電線。","actionLabel":"先整理乾淨再開始寫","death":"d_e_desk"},{"id":"e_tablet","room":"r401","name":"平板","look":"追到一半的劇停在片頭。","actionLabel":"看一集就好","death":"d_e_tablet"},{"id":"e_exam","room":"r401","name":"考古題","look":"這章老師說「大概不會考」。","actionLabel":"這章跳過","death":"d_e_exam"},{"id":"e_timetable","room":"r401","name":"牆上的課表","look":"明天早上 8:10 有課。","actionLabel":"明天早八先翹","death":"d_e_timetable"},{"id":"e_citation","room":"r401","name":"抄來的一句話","look":"一句很好用的話，沒寫出處。","actionLabel":"出處之後再補","death":"d_e_citation"},{"id":"e_whiteboard_role","room":"r401","name":"分工表","look":"白板上的分工表，「整合」那一欄是空的。","actionLabel":"寫上自己的名字","death":"d_e_integrate"},{"id":"e_yearbook","room":"hall","name":"紀念冊攝影徵求","look":"畢業紀念冊徵求攝影，「攝影師不用入鏡喔」。","actionLabel":"報名攝影","death":"d_e_yearbook"},{"id":"e_survey","room":"hall","name":"問卷 QR code","look":"學長的畢業專題問卷：「填個問卷而已～」","actionLabel":"掃來填","death":"d_e_survey"},{"id":"e_delivery","room":"pantry","name":"外送 App","look":"肚子好餓，差一點就免運。","actionLabel":"多點一樣湊免運","death":"d_e_delivery"},{"id":"e_drinks","room":"pantry","name":"手搖飲菜單","look":"第二杯半價。","actionLabel":"揪大家一起訂，我先墊","death":"d_e_drinks"},{"id":"e_labsignup","room":"r503","name":"教授的留言板","look":"「有興趣來實驗室看看的同學，請留名。」","actionLabel":"寫上名字","death":"d_e_labsignup"},{"id":"e_seniorcode","room":"r503","name":"學長的電腦","look":"螢幕上貼著：「幫我看一下就好」。","actionLabel":"看一下，順手修 bug","death":"d_e_seniorcode"},{"id":"e_format","room":"r503","name":"阿哲的另一份檔案","look":"格式亂到不行。","actionLabel":"幫他改好","death":"d_e_format"},{"id":"e_printer","room":"office","name":"印表機","look":"卡紙了，上一個人的工作卡在一半。","actionLabel":"幫忙把紙拉出來","death":"d_e_printer"},{"id":"e_studygroup","room":"office","name":"讀書會簽到表","look":"「簽個名而已」。","actionLabel":"簽名","death":"d_e_studygroup"},{"id":"e_restore","room":"lab","name":"隔壁那台電腦","look":"開機很快，桌面很乾淨。","actionLabel":"用這台寫，存在桌面","death":"d_e_restore"},{"id":"e_sync","room":"lab","name":"第二台電腦","look":"雲端同步中。","actionLabel":"兩台一起開同一份","death":"d_e_sync"},{"id":"e_usbseat","room":"lab","name":"空位子","look":"想去裝個水。","actionLabel":"插著隨身碟先佔位","death":"d_e_usbseat"},{"id":"e_guardpc","room":"floor1","name":"警衛室的電腦","look":"便條：「誰會修？」","actionLabel":"幫伯伯修好","death":"d_e_guardpc"},{"id":"e_bbq","room":"floor1","name":"系烤報名表","look":"「缺主持人，有空的寫名字」。","actionLabel":"寫上名字","death":"d_e_bbq"}]},"endings":{"trueEndingCodexRequired":10,"endings":[{"id":"end_dawn","no":41,"title":"天亮了","condition":"時鐘走到 07:00","lines":["07:00:01。","進度條停在 99%，你遲交了 1 分鐘。"],"art":"end_dawn"},{"id":"end_no_submit","no":42,"title":"人出來了，報告沒交","condition":"沒交 Moodle 就走出大門","lines":["凌晨的空氣很好。","報告還在你的隨身碟裡。"],"art":"end_no_submit"},{"id":"end_normal","no":43,"title":"交了，也出來了","condition":"交完報告、走出大門，在結局畫面直接按「回家睡覺」","lines":["你回家倒頭就睡。","後來你上台講組員做的投影片，那是你第一次看到內容。","學姊走過來：「那幫我顧攤十分鐘？」"],"art":"end_normal"},{"id":"end_true","no":44,"title":"1 則未讀","condition":"交完報告、走出大門，圖鑑收集到 10 格以上，在結局畫面點開那則一直沒看的課程公告","lines":["你終於點開那則未讀。","課程公告（00:30）：本次報告延期一週。","老師只發了公告，忘了改 Moodle 的截止時間。","就跟那扇門一樣，其實都沒鎖。"],"art":"end_true"}]},"rooms":{"start":"r401","rooms":[{"id":"r401","name":"401 專題教室","requires":{},"exits":["hall"],"clues":[{"id":"c_exam_calc","name":"揉爛的考卷（微積分）","text":"微積分期中考，10/14，58 分。","forPuzzle":"p1"},{"id":"c_exam_stat","name":"揉爛的考卷（統計）","text":"統計期中考，10/21，61 分。","forPuzzle":"p1"},{"id":"c_laptop_note","name":"螢幕背面的便利貼","text":"密碼＝這學期期中考的兩科分數，照考試日期排。","forPuzzle":"p1"},{"id":"c_whiteboard","name":"白板角落","text":"值日生：講桌密碼＝老師口頭禪。","forPuzzle":"p2"},{"id":"c_syllabus","name":"課綱","text":"每一頁的頁尾都蓋著同一個章：「遲交不收」。","forPuzzle":"p2"}]},{"id":"hall","name":"四樓走廊","requires":{"items":["key_backdoor"]},"exits":["r401","pantry","r503","office","lab","floor1"],"clues":[{"id":"c_floorplan","name":"逃生平面圖","text":"從 401 到茶水間，會經過第 2、3、5 段走廊。","forPuzzle":"p3"},{"id":"c_plaque","name":"系館匾額","text":"本館於西元 1987 年落成。","forPuzzle":"p6"}]},{"id":"pantry","name":"茶水間","requires":{"puzzles":["p3"]},"exits":["hall"],"clues":[{"id":"c_pantry_board","name":"茶水間白板","text":"學長畫的四罐飲料：咖啡、咖啡、紅茶、能量飲。旁邊寫「卡住的東西這樣按會掉出來」。","forPuzzle":"p4"}]},{"id":"r503","name":"503 研究室","requires":{"items":["key_503"]},"exits":["hall"],"clues":[{"id":"c_sleeptalk","name":"說夢話的阿哲","text":"「演算法……第三版……作業系統……資料庫……網路……」","forPuzzle":"p5"}]},{"id":"office","name":"系辦","requires":{"puzzles":["p5"]},"exits":["hall"],"clues":[{"id":"c_trash_notice","name":"垃圾桶裡的公告草稿","text":"本月門禁密碼改為系館落成年份（西元）。","forPuzzle":"p6"}]},{"id":"lab","name":"電腦教室","requires":{"puzzles":["p6"]},"exits":["hall"],"clues":[]},{"id":"floor1","name":"一樓（廣播室、警衛室、大門）","requires":{"items":["key_floor1"]},"exits":["hall"],"clues":[{"id":"c_broadcast_manual","name":"廣播台使用說明","text":"頻道：全館／一樓／五樓。夜間請用小音量。","forPuzzle":"p8"},{"id":"c_guard","name":"警衛室","text":"伯伯抱著鐵捲門遙控器睡得很熟。桌上有一張早餐店的集點卡。","forPuzzle":"p8"}]}]},"hints":{"aiQuota":3,"aiQuotaOutText":"AI 回你「好的，我來幫你」，然後額度就用完了。","senpaiAfterDeaths":3,"senpaiSignature":"——學長，有空吃個飯～","idleSeconds":60,"puzzles":{"p1":{"idle":"考卷好像有寫日期……","ai":["密碼跟那兩張考卷有關。","照考試日期排：先 58 再 61。"],"senpai":"更新別按稍後，排到交完再更。"},"p2":{"idle":"這句話我好像在課綱上看過很多次。","ai":["老師的口頭禪蓋在課綱每一頁。","滾輪轉成「遲交不收」。"],"senpai":"抽屜裡的東西，拿了就走。"},"p3":{"idle":"牆上那張逃生圖好像有編號。","ai":["逃生平面圖標出了去茶水間會經過哪幾段。","只開 2、3、5。"],"senpai":"半夜媽媽打來，傳訊息就好。"},"p4":{"idle":"白板上那四罐飲料是什麼意思？","ai":["照白板上飲料的順序按。","咖啡、咖啡、紅茶、能量飲。"],"senpai":"那張沙發吃掉過很多人。"},"p5":{"idle":"阿哲在講夢話……好像是書名。","ai":["照阿哲夢話裡的順序抽書。","演算法、作業系統、資料庫、網路。最新的檔案看修改時間。"],"senpai":"阿哲剛睡醒會亂按，別讓他碰電腦。"},"p6":{"idle":"走廊的匾額上好像有年份。","ai":["門禁密碼是系館落成年份。","1987。"],"senpai":"白板上的徵求，不用回。"},"p7":{"idle":"公用電腦記住的帳號，不一定是我的。","ai":["登入要用自己的帳號，密碼跟筆電一樣。","清掉欄位輸入 5861，再從行事曆點回今年的課。"],"senpai":"交之前先看共用檔的字數。"},"p8":{"idle":"伯伯只要醒來就好，不用整棟都醒。","ai":["只叫醒伯伯，而且要讓他想出門。","一樓頻道、大冰奶好了、小音量。"],"senpai":"出門遇到誰，都說下次一定。"}}},"texts":{"clock":{"start":60,"dawn":420,"perSolve":20,"perDeath":10},"opening":["00:50，401 專題教室。","三週前你說「我都可以」，所以你是組長。","報告早上 07:00 要交到 Moodle。"],"openingChat":{"title":"軟工第三組（4）","messages":[{"from":"阿哲","text":"抱歉，我好像把雲端那份刪了"},{"from":"阿哲","text":"（貼圖：跪下的貓）"},{"from":"小美","text":"？？？"},{"from":"阿明","text":"（貼圖：OK）","note":"上一則是三週前"},{"from":"你","text":"阿哲你還在嗎","me":true},{"from":"你","text":"阿哲？？","me":true},{"sys":true,"text":"已讀 2"}]},"flavor":{"speaker":"你","roomEnter":{"r401":["先看看筆電吧。螢幕背面好像貼了東西。"],"hall":["走廊好暗，只剩緊急出口的綠燈。","白天吵成那樣，晚上安靜得有點可怕。"],"pantry":["冰箱上貼著「請勿偷喝別人的飲料」，下面有人補了一句「誰偷喝我的豆漿」。"],"r503":["阿哲睡得很熟，筆電螢幕是黑的。","研究室的冷氣永遠開 22 度。"],"office":["系辦。白天要抽號碼牌才進得來。"],"lab":["每台電腦都貼著「下課請登出」。沒有人登出。"],"floor1":["警衛室傳來電視的聲音，還有打呼聲。"]},"puzzleIntro":{"p1":"筆電要密碼。我有設密碼嗎？我有設密碼。","p2":"講桌抽屜鎖著。老師的東西不能亂動……但我需要鑰匙。","p3":"這排開關沒有標籤。系館的開關從來都沒有標籤。","p4":"這台販賣機上次吃了我 50 塊，什麼都沒掉出來。","p5":"阿哲的筆電沒電了。他的充電器該不會又借人了吧。","p6":"系辦的門禁。白天都開著，半夜才知道它有密碼。","p7":"Moodle。這輩子最常打開的網站。","p8":"廣播台。小學的時候就一直很想按按看。"},"quips":{"c_exam_calc":["58 分。差 2 分。老師說不能調。"],"c_exam_stat":["61 分。及格就是勝利。"],"c_laptop_note":["把密碼提示貼在螢幕背面，資安課老師看到會哭。"],"c_whiteboard":["值日生的字比老師的好看。"],"c_syllabus":["整份課綱最清楚的就是這四個字。"],"c_floorplan":["讀了三年，第一次看這張逃生圖。"],"c_plaque":["這棟樓比我爸媽認識的時間還久。"],"c_pantry_board":["又是學長的字。這棟樓到處都是他的便利貼。"],"c_sleeptalk":["他連說夢話都在念書單。","阿哲翻了個身：「結論……我等等寫……」"],"c_trash_notice":["把門禁密碼的公告丟在門口垃圾桶，很系辦。"],"c_broadcast_manual":["「夜間請用小音量」，所以有人半夜用過。"],"c_guard":["伯伯睡得好香。他早上也要上班吧。"]},"retry":["……剛剛那是想像。再來。","還好只是想像。","冷靜，時間還有。應該。","我剛剛到底在幹嘛。"],"items":{"key_backdoor":"後門鑰匙","key_503":"503 的鑰匙","usb_report":"隨身碟（報告在裡面）","key_floor1":"一樓的鑰匙"},"chatter":[{"at":100,"from":"軟工第三組","text":"小美：我先睡囉，報告就麻煩組長了～"},{"at":140,"from":"系學會","text":"學長：學弟有空嗎？下週吃個飯～"},{"at":180,"from":"Moodle","text":"提醒：「期中報告」將在 4 小時後截止。"},{"at":220,"from":"軟工第三組","text":"阿明：大家報告寫得怎樣了？（他這三週的第一則訊息）"},{"at":260,"from":"媽媽","text":"早點睡，不要熬夜。（傳送時間 04:20）"},{"at":300,"narration":true,"text":"窗外的天空開始變藍了。"},{"at":330,"from":"外送平台","text":"肚子餓了嗎？宵夜時段只剩 30 分鐘！"},{"at":360,"narration":true,"text":"第一班公車開過去了。"},{"at":390,"from":"Moodle","text":"提醒：「期中報告」將在 30 分鐘後截止。"},{"at":410,"narration":true,"text":"樓下早餐店的鐵門拉開了。"}]},"tutorialNote":"學弟，卡關就看我的便利貼。——學長，有空吃個飯～","guardLocks":["走廊傳來鐵鍊聲。","警衛伯伯把樓層的門鎖上，回一樓睡覺了。"],"doorLocked":"門被鎖了。","phoneBadge":"1 則未讀：課程公告","phoneTapDuringNight":"課程公告？等交完再看。","finale":{"prompt":"鐵捲門外，天快亮了。手機還有 1 則未讀。","home":"回家睡覺","unread":"點開 1 則未讀","unreadLocked":"手機跳出「儲存空間不足」。你翻了一下相簿，一張截圖都捨不得刪。","unreadLockedHint":"圖鑑收集到 {required} 格，手機才點得開（目前 {found} 格）。"},"deathCardCorner":["學長經驗談：叫 AI 列參考文獻，館員說那本書還沒出版。","學長經驗談：交出去之前，先看檔名。","學長經驗談：「我都可以」是最貴的一句話。"],"deathCardRetry":"再來一次","deathTimeCost":"時間 +10 分鐘","results":{"peerReview":"組員互評：全組只有你被打 2 分，理由是「比較少講話」。","rememberedAccount":"你在公用電腦勾了「記住帳號」。下一個用這台電腦的人，幫你交了期末報告。","passwordCorner":"你的密碼全部都一樣，這次救了你。"}},"moodle":{"note":"第 7 關假 Moodle 頁面的畫面文字。流程與判定在 puzzles.json 的 p7，這裡只放畫面要顯示的字與配色。不放真實校名與校徽。","schoolName":"國立夜貓大學","logo":"像素貓頭鷹（佔位）","theme":{"background":"#1e1f24","titleBar":"#7a1f2b","loginLeft":"#2f6fb5","loginRight":"#2a2c33","primaryButton":"#2f6fb5","text":"#e8e8ea"},"titleBar":{"title":"國立夜貓大學 Moodle 數位學習平台 ver. 3.7","hamburger":true,"language":"地球圖示","guestStatus":"您正使用訪客身分瀏覽（登入）"},"sidebar":["首頁","行事曆"],"loginPage":{"backgroundArt":"一群人圍著桌子討論的插畫（佔位）","left":{"title":"國立夜貓大學 Moodle3.7 數位學習平台","lines":["您的瀏覽器必須啟動 Cookies 功能","有些課程可能允許訪客瀏覽"],"guestButton":"以訪客身分登入"},"right":{"title":"已經有一個帳號？","usernamePlaceholder":"帳號","passwordPlaceholder":"密碼","autofilledUsername":"上一個人的學號（公用電腦記住的）","remember":"記住帳號","loginButton":"登入","forgot":"忘記帳號或密碼嗎？"}},"guestDialog":{"title":"確認","text":"訪客無法存取用戶個人資料表。以完整的用戶帳號登入才能繼續。","buttons":["繼續","取消"]},"footer":"保持聯繫：如有任何功能操作問題，敬請來信管理者信箱","home":{"myCourses":["軟體工程導論（去年）","軟體工程導論（今年）","通識：生活中的統計"],"calendarEvent":"期中報告截止 07:00"},"assignment":{"title":"期中報告繳交區","statusDraft":"繳交狀態：尚未繳交","statusDone":"繳交狀態：已繳交"},"stageScreens":{"submit":"course","guest_dialog":"course+dialog","login_choice":"login","login":"login","find_course":"home","final_submit":"course"}}};
const __CSS = {"game/ui/audio.css":"/* 靜音開關：固定在左下角 */\n.au-mute { position: fixed; left: 10px; bottom: 10px; z-index: 9000; font-size: 12px; padding: 4px 10px; opacity: .8; }\n.au-mute:hover { opacity: 1; }\n","game/ui/debug-panel.css":"/* 除錯面板：固定在右下角，只在 ?debug=1 出現 */\n.dbg { position: fixed; right: 10px; bottom: 10px; z-index: 9500; width: 300px; max-height: 80vh; overflow: auto; background: #10131aee; border: 2px solid var(--accent, #f0b429); border-radius: 0; padding: 6px 10px 10px; font-size: 12px; }\n.dbg summary { cursor: pointer; font-weight: 700; color: var(--accent, #f0b429); }\n.dbg-status { font-family: var(--font); color: #9fe3b0; margin: 4px 0; }\n.dbg-row { display: flex; gap: 6px; align-items: center; margin: 5px 0; }\n.dbg-row label { width: 36px; flex: none; color: #aab; }\n.dbg-row select { flex: 1; min-width: 0; background: #1f232d; color: inherit; border: 2px solid #343a4a; border-radius: 0; padding: 2px; }\n.dbg-row input { background: #1f232d; color: inherit; border: 2px solid #343a4a; border-radius: 0; padding: 2px 4px; }\n.dbg button.danger { border-color: var(--danger, #e5484d); color: #ff9a9d; }\n.dbg-params, .dbg-log { font-size: 12px; color: #aab; word-break: break-all; margin-top: 4px; }\n","game/ui/flavor.css":"/* 氣氛與台詞（flavor.js） */\nbody { background: radial-gradient(ellipse at 50% -20%, color-mix(in srgb, var(--sky, #0a0f2c) 55%, transparent), transparent 60%), var(--bg); background-attachment: fixed; transition: background .8s; }\n\n/* 主角的對話框：畫面下方，像 RPG 的對話框 */\n.fv-say { position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 58; width: min(640px, 92vw);\n  background: #11131a; border: 3px solid #f2ede0; box-shadow: 0 0 0 3px #11131a, 6px 6px 0 3px #000;\n  padding: 10px 16px 12px; color: #f2ede0; cursor: pointer; animation: fv-in .18s steps(3) both; }\n.fv-say[hidden] { display: none; }\n.fv-who { display: inline-block; font: 12px/1.5 var(--font); letter-spacing: .1em; color: #11131a; background: var(--accent); padding: 3px 8px; margin-bottom: 6px; }\n.fv-line { font-size: 12px; line-height: 1.6; min-height: 1.6em; }\n.fv-say.narration { border-color: #6b7390; background: rgba(10, 12, 20, .9); }\n.fv-say.narration .fv-line { color: #c9cfe6; text-align: center; }\n.fv-say::after { content: '▼'; position: absolute; right: 12px; bottom: 6px; font-size: 12px; color: var(--accent); animation: fv-blink 1s steps(2) infinite; }\n@keyframes fv-in { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translateX(-50%); } }\n@keyframes fv-blink { 50% { opacity: 0; } }\n\n/* 拿到道具 */\n.fv-item { position: fixed; left: 50%; top: 42%; z-index: 59; display: flex; align-items: center; gap: 10px; transform: translate(-50%, -50%);\n  background: #f2ede0; color: #1b1a17; border: 3px solid #1b1a17; box-shadow: 6px 6px 0 #000; padding: 10px 18px; font-size: 12px; pointer-events: none; }\n.fv-item[hidden] { display: none; }\n.fv-item.on { animation: fv-pop 2.2s ease both; }\n.fv-item-icon { width: 22px; height: 22px; background:\n  linear-gradient(#f0b429, #f0b429) 2px 8px / 12px 6px no-repeat,\n  linear-gradient(#f0b429, #f0b429) 12px 6px / 8px 10px no-repeat,\n  linear-gradient(#1b1a17, #1b1a17) 14px 9px / 4px 4px no-repeat; image-rendering: pixelated; }\n.fv-item-label { font: 12px/1.5 var(--font); background: #1b1a17; color: #f2ede0; padding: 3px 6px; }\n@keyframes fv-pop { 0% { opacity: 0; transform: translate(-50%, -30%) scale(.6); } 12% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }\n  20% { transform: translate(-50%, -50%) scale(1); } 80% { opacity: 1; transform: translate(-50%, -50%); } 100% { opacity: 0; transform: translate(-50%, -80%); } }\n\n/* 手機通知 */\n.fv-notes { position: fixed; right: 12px; top: calc(var(--hud-h, 0px) + 8px); z-index: 57; display: flex; flex-direction: column; gap: 6px; width: min(300px, 80vw); pointer-events: none; }\n.fv-note { background: #f7f7f9; color: #1b1a17; border-radius: 0; padding: 8px 12px; box-shadow: 3px 3px 0 #000; animation: fv-slide .3s ease both; transition: opacity .5s, transform .5s; }\n.fv-note.out { opacity: 0; transform: translateX(30px); }\n.fv-note-from { font-size: 12px; font-weight: 700; color: #06c755; }\n.fv-note-text { font-size: 12px; line-height: 1.5; }\n@keyframes fv-slide { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }\n\n/* 死掉的那一下：整個畫面紅一閃、抖一下 */\n.fv-hit #app { animation: fv-shake .35s steps(6); }\n@keyframes fv-shake { 0%, 100% { transform: none; } 20% { transform: translate(-6px, 2px); } 40% { transform: translate(5px, -3px); } 60% { transform: translate(-4px, 1px); } 80% { transform: translate(3px, 2px); } }\n/* 謎題打開時對話框移到上面，才不會蓋住謎題的按鈕 */\nbody:has(#puzzle-root .pz-overlay) .fv-say { bottom: auto; top: calc(var(--hud-h, 0px) + 8px); }\nbody:has(#puzzle-root .pz-overlay) .fv-notes { top: auto; bottom: 12px; }\n","game/ui/hud/hud.css":"/* WP6 HUD 樣式：像素風，全部用 CSS 畫，不用外部字型與圖 */\n#hud-root { position: relative; z-index: 60; } /* 比謎題浮層（50）高，解題時也能問助教 */\n.hd { display: flex; align-items: stretch; gap: 8px; padding: 6px 8px; padding-right: 190px; /* 右邊留給圖鑑／重新開始按鈕 */\n  background: #1a1d27; border: 2px solid var(--line); border-radius: 0; box-shadow: 0 0 0 2px #0b0d12, 3px 3px 0 2px #0b0d12; }\n.hd-left { display: flex; align-items: center; gap: 8px; }\n.hd-mid { flex: 1; min-width: 0; display: flex; align-items: center; }\n.hd-right { display: flex; align-items: center; gap: 8px; }\n\n.hd-clock { position: relative; display: flex; flex-direction: column; align-items: center; padding: 2px 10px; background: #0b0d12; border: 2px solid #4a5166; min-width: 96px; }\n.hd-clock-label { font-size: 12px; color: #8a90a4; letter-spacing: .15em; }\n.hd-clock-time { font: 24px/1.5 var(--font); color: #7fffa0; text-shadow: 2px 2px 0 #0b0d12; letter-spacing: .08em; }\n.hd-clock.late .hd-clock-time { color: #ffb347; text-shadow: 2px 2px 0 #0b0d12; }\n.hd-clock.jump { animation: hd-jump .5s steps(5); }\n.hd-clock-plus { position: absolute; right: -4px; top: -10px; font: 12px/1.5 var(--font); color: #ff6b6b; opacity: 0; pointer-events: none; }\n.hd-clock-plus.on { animation: hd-plus 1.6s steps(8) forwards; }\n@keyframes hd-jump { 0% { transform: translateY(0); } 30% { transform: translateY(-5px); } 60% { transform: translateY(2px); } 100% { transform: translateY(0); } }\n@keyframes hd-plus { 0% { opacity: 1; transform: translateY(0); } 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(-12px); } }\n\n.hd-map-canvas { image-rendering: pixelated; display: block; flex: none; /* 不用 CSS 縮放，畫布本身就是顯示尺寸 */ }\n\n.hd-task { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 10px; background: #0b0d12; border: 2px solid #4a5166; border-left: 6px solid var(--accent); }\n.hd-task-tag { flex: none; font: 12px/1.5 var(--font); color: #1a1405; background: var(--accent); padding: 3px 6px; }\n.hd-task-body { font-size: 12px; line-height: 1.4; }\n\n.hd-ai, .hd-phone { position: relative; display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: #12202a; border: 2px solid #3b7a8f; border-radius: 0; color: #dff6ff; box-shadow: 2px 2px 0 #0b0d12; }\n.hd-ai:hover:not(:disabled), .hd-phone:hover:not(:disabled) { border-color: #ffe27a; transform: translate(-1px, -1px); }\n.hd-ai.empty { background: #2a1a1a; border-color: #8f3b3b; }\n.hd-ai-quota { font: 12px/1.5 var(--font); color: #7fe3ff; }\n.hd-ai.empty .hd-ai-quota { color: #ff8a8a; }\n.hd-icon { image-rendering: pixelated; flex: none; }\n.hd-phone { background: #2a2a1a; border-color: #8f843b; }\n.hd-phone-badge { position: absolute; left: 4px; top: -8px; min-width: 18px; padding: 2px 4px; background: var(--danger); color: #fff; font: 12px/1.5 var(--font); text-align: center; border: 2px solid #0b0d12; animation: hd-blink 1.2s steps(2) infinite; }\n.hd-phone-text { font-size: 12px; }\n@keyframes hd-blink { 50% { background: #ff8a8a; } }\n\n.hd-bubble { position: fixed; top: 92px; left: 50%; transform: translateX(-50%); z-index: 70; max-width: min(520px, 92vw); padding: 8px 14px; background: #0b0d12; color: #fff; border: 2px solid #7fe3ff; box-shadow: 3px 3px 0 #000; cursor: pointer; }\n.hd-bubble[hidden] { display: none; }\n.hd-bubble.out { border-color: #ff8a8a; }\n.hd-bubble.idle { border-color: #f4f1de; border-style: dashed; }\n.hd-bubble-who { font: 12px/1.5 var(--font); color: #7fe3ff; margin-bottom: 4px; }\n.hd-bubble.out .hd-bubble-who { color: #ff8a8a; }\n.hd-bubble.idle .hd-bubble-who { color: #d7d3bd; }\n.hd-bubble-text { font-size: 12px; line-height: 1.5; }\n.hd-bubble-meta { margin-top: 4px; font: 12px/1.5 var(--font); color: #8a90a4; }\n.hd-bubble-meta:empty { display: none; }\n\n@media (max-width: 1100px) {\n  .hd { flex-wrap: wrap; padding-right: 8px; }\n  .hd-mid { flex-basis: 100%; order: 3; }\n}\n","game/ui/pixel-font.css":"/* 由 scripts/build-font.py 產生，不要手改。Fusion Pixel Font 12px（OFL-1.1），來源見 CREDITS.md */\n@font-face { font-family: \"Pixel Font\"; src: url(data:font/woff2;base64,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) format(\"woff2\"); font-weight: 400 700; font-style: normal; }\n","game/ui/puzzles/moodle.css":"/* 第 7 關假 Moodle（WP4）：深色主題，深紅標題列，登入頁左藍右黑。校徽與圖形全用 CSS／內嵌 SVG。 */\n.mdl-wrap { width: min(980px, 96vw); max-height: calc(100vh - var(--hud-h, 0px) - 12px); display: flex; flex-direction: column; gap: 6px; color: var(--mdl-text); font-size: 12px; }\n.mdl-wrap.shake { animation: pz-shake .35s; }\n.mdl-caption { display: flex; align-items: center; gap: 10px; background: #11131a; border: 1px solid var(--line); border-radius: 6px; padding: 6px 10px; color: #cfd2dc; font-size: 12px; }\n.mdl-caption span { flex: 1; }\n.mdl-caption .mdl-x { padding: 1px 8px; }\n.mdl-win { position: relative; background: var(--mdl-bg); border: 1px solid #000; border-radius: 4px; overflow: hidden auto; display: flex; flex-direction: column; min-height: 420px; max-height: calc(100vh - var(--hud-h, 0px) - 70px); }\n.mdl-win button { font: inherit; }\n.mdl-bar { display: flex; align-items: center; gap: 14px; background: var(--mdl-bar); padding: 8px 14px; color: #fff; }\n.mdl-burger { display: flex; flex-direction: column; gap: 4px; }\n.mdl-burger i { display: block; width: 20px; height: 2px; background: #fff; }\n.mdl-title { display: flex; align-items: center; gap: 8px; font-weight: 600; flex: 1; }\n.mdl-logo { width: 28px; height: 28px; background: #3a2a1a; border-radius: 4px; padding: 2px; flex: none; }\n.mdl-right { display: flex; align-items: center; gap: 8px; font-size: 12px; }\n.mdl-globe { width: 18px; height: 18px; color: #fff; }\n.mdl-status u { cursor: pointer; }\n.mdl-body { display: flex; flex: 1; min-height: 0; }\n.mdl-side { width: 140px; flex: none; background: #181a1f; border-right: 1px solid #000; padding: 10px 0; display: flex; flex-direction: column; }\n.mdl-nav { background: none; border: 0; border-left: 3px solid transparent; border-radius: 0; text-align: left; padding: 8px 16px; color: var(--mdl-text); cursor: pointer; }\n.mdl-nav:hover:not(:disabled) { background: #23262d; }\n.mdl-nav.on { border-left-color: var(--mdl-btn); background: #23262d; }\n.mdl-main { flex: 1; padding: 16px 22px; min-width: 0; }\n.mdl-main h1 { font-size: 24px; margin: 6px 0 14px; font-weight: 500; }\n.mdl-crumb { font-size: 12px; color: #9aa0ad; }\n.mdl-table { border: 1px solid #3a3d46; border-radius: 4px; margin-bottom: 14px; }\n.mdl-row { display: flex; padding: 8px 12px; border-top: 1px solid #3a3d46; }\n.mdl-row:first-child { border-top: 0; }\n.mdl-row .k { width: 110px; flex: none; color: #9aa0ad; }\n.mdl-team { background: #262a33; border-left: 3px solid var(--mdl-btn); border-radius: 4px; padding: 8px 12px; margin-bottom: 14px; }\n.mdl-team p { margin: 4px 0 0; }\n.mdl-actions { display: flex; gap: 10px; }\n.mdl-primary { background: var(--mdl-btn) !important; color: #fff !important; border: 1px solid #1f5a9b !important; border-radius: 4px; padding: 7px 18px !important; cursor: pointer; }\n.mdl-primary:hover:not(:disabled) { background-color: #3b86d6 !important; }\n.mdl-primary:disabled { opacity: .55; cursor: default; }\n.mdl-sec { background: #3a3d46 !important; color: var(--mdl-text) !important; border: 1px solid #555 !important; padding: 7px 14px !important; border-radius: 4px; cursor: pointer; }\n.mdl-courses { display: flex; flex-direction: column; gap: 10px; }\n.mdl-course { display: flex !important; align-items: center; gap: 12px; text-align: left; background: #262a33 !important; border: 1px solid #3a3d46 !important; color: var(--mdl-text) !important; border-radius: 4px; padding: 10px 12px !important; cursor: pointer; }\n.mdl-course:hover { border-color: var(--mdl-btn) !important; }\n.mdl-thumb { width: 54px; height: 36px; border-radius: 3px; background: linear-gradient(135deg, #2f6fb5, #7a1f2b); flex: none; }\n.mdl-cname { flex: 1; }\n.mdl-recent { font-size: 12px; color: #9aa0ad; }\n.mdl-cal { border: 1px solid #3a3d46; border-radius: 4px; padding: 10px 12px; }\n.mdl-cal-head { color: #9aa0ad; font-size: 12px; margin-bottom: 8px; }\n.mdl-event { background: #263a52 !important; border: 1px solid #2f6fb5 !important; color: var(--mdl-text) !important; padding: 8px 12px !important; border-radius: 4px; cursor: pointer; text-align: left; }\n.mdl-shade { position: absolute; inset: 44px 0 28px; background: rgba(0, 0, 0, .55); display: flex; align-items: center; justify-content: center; }\n.mdl-dialog { background: #2a2c33; border: 1px solid #555; border-radius: 4px; width: min(420px, 86%); padding: 16px 18px; }\n.mdl-dialog h2 { margin: 0 0 8px; font-size: 12px; font-weight: 500; }\n.mdl-dialog p { margin: 0 0 14px; }\n.mdl-dialog .mdl-actions { justify-content: flex-end; }\n.mdl-login { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 22px 12px; background: linear-gradient(160deg, #1c2a3c 0%, #1e1f24 55%, #2a1a20 100%); }\n.mdl-login-card { display: flex; width: min(760px, 94%); min-height: 280px; box-shadow: 4px 4px 0 #000; }\n.mdl-login-left { flex: 1; background: var(--mdl-left); padding: 20px; display: flex; flex-direction: column; gap: 6px; }\n.mdl-login-left h2 { margin: 8px 0; font-size: 12px; }\n.mdl-login-left p { margin: 0; font-size: 12px; color: #e3eefb; }\n.mdl-login-left .mdl-logo { width: 40px; height: 40px; background: #1f4f85; }\n.mdl-ghost { margin-top: auto; background: transparent !important; border: 1px solid #fff !important; color: #fff !important; border-radius: 4px; padding: 7px 12px !important; cursor: pointer; }\n.mdl-ghost:hover { background: rgba(255, 255, 255, .15) !important; }\n.mdl-login-right { flex: 1; background: var(--mdl-right); padding: 20px; display: flex; flex-direction: column; gap: 10px; }\n.mdl-login-right h2 { margin: 0 0 4px; font-size: 12px; font-weight: 500; }\n.mdl-login-right input[type=text], .mdl-login-right input[type=password] { background: #fff; color: #222; border: 1px solid #888; border-radius: 3px; padding: 7px 10px; font: inherit; }\n.mdl-login-right input[readonly] { background: #dfe6f1; }\n.mdl-remember { font-size: 12px; }\n.mdl-wide { width: 100%; }\n.mdl-link { background: none !important; border: 0 !important; color: #6fb1f2 !important; padding: 2px 0 !important; text-align: left; cursor: pointer; text-decoration: underline; width: fit-content; }\n.mdl-contact { color: #9aa0ad !important; font-size: 12px; }\n.mdl-footer { background: #181a1f; color: #9aa0ad; font-size: 12px; padding: 6px 14px; border-top: 1px solid #000; }\n.mdl-note { padding: 8px 12px; border-radius: 4px; background: #11131a; border-left: 3px solid var(--line); }\n.mdl-note.bad { border-left-color: var(--danger); color: #ffb4b6; }\n.mdl-note.ok { border-left-color: var(--accent); }\n@media (max-width: 640px) { .mdl-login-card { flex-direction: column; } .mdl-side { width: 90px; } }\n","game/ui/puzzles/puzzles.css":"/* 通用謎題介面（WP3） */\n.pz-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, .6); display: flex; align-items: center; justify-content: center; z-index: 50; box-sizing: border-box; padding-top: var(--hud-h, 0px); /* 讓開疊在上面的 HUD */ }\n.pz-card { background: var(--panel); border: 2px solid var(--accent); border-radius: 0; padding: 16px 18px; width: min(520px, 92vw); max-height: calc(100vh - var(--hud-h, 0px) - 24px); overflow-y: auto; }\n.pz-card.shake { animation: pz-shake .35s; }\n@keyframes pz-shake { 25% { transform: translateX(-8px); } 50% { transform: translateX(8px); } 75% { transform: translateX(-5px); } }\n.pz-head { display: flex; align-items: center; gap: 10px; color: var(--accent); }\n.pz-head .pz-step-no { margin-left: auto; font-size: 12px; color: #aab; }\n.pz-prompt { margin: 10px 0; }\n.pz-body { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }\n.pz-card button { padding: 6px 12px; }\n.pz-card button.primary { border-color: var(--accent); color: var(--accent); }\n.pz-close { padding: 2px 8px !important; }\n.pz-code { font: 24px/1.5 var(--font); letter-spacing: .3em; width: 100%; padding: 6px 10px; background: #11131a; color: var(--fg); border: 2px solid var(--line); border-radius: 0; }\n.pz-wheels { display: flex; gap: 10px; }\n.pz-wheel { display: flex; flex-direction: column; align-items: center; gap: 4px; }\n.pz-glyph { font-size: 24px; width: 56px; text-align: center; background: #11131a; border: 2px solid var(--line); border-radius: 0; padding: 4px 0; }\n.pz-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; width: 100%; }\n.pz-picked { font-size: 12px; color: #aab; }\n.pz-row { display: flex; gap: 8px; }\n.pz-switches { display: flex; gap: 8px; flex-wrap: wrap; }\n.pz-switch.on { background: #4a3d12; border-color: var(--accent); }\n.pz-field select { background: #11131a; color: var(--fg); border: 2px solid var(--line); border-radius: 0; padding: 4px; font: inherit; }\n.pz-options { display: flex; flex-direction: column; gap: 8px; width: 100%; }\n.pz-option { text-align: left; }\n.pz-desc { display: block; font-size: 12px; color: #aab; }\n.pz-note { margin-top: 12px; padding: 8px 10px; border-radius: 0; background: #11131a; border-left: 3px solid var(--line); }\n.pz-note.bad { border-left-color: var(--danger); color: #ffb4b6; }\n.pz-note.ok { border-left-color: var(--accent); }\n","game/ui/screens/screens.css":"/* WP5 畫面樣式：全部掛在 #screen-root 底下 */\n#screen-root { position: fixed; inset: 0; z-index: 900; pointer-events: none; }\n#screen-root > * { pointer-events: auto; }\n.sc-overlay { position: fixed; inset: 0; display: flex; align-items: safe center; justify-content: center; background: rgba(6, 7, 10, .985); z-index: 1000; padding: 12px; overflow: auto; }\n.sc-overlay.clear { background: rgba(6, 7, 10, .8); }\n.sc-overlay button { padding: 8px 18px; font-size: 12px; }\n.sc-overlay button.primary { background: var(--accent); color: #1a1405; border-color: var(--accent); font-weight: 700; }\n.sc-art { image-rendering: pixelated; width: 100%; aspect-ratio: 1; display: block; background: #000; }\n.sc-menu { position: fixed; top: 8px; right: 8px; z-index: 800; display: flex; gap: 6px; pointer-events: auto; }\n.sc-menu button { background: rgba(31, 35, 45, .92); }\n.sc-fade { animation: sc-fade .6s ease both; }\n@keyframes sc-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }\n@keyframes sc-out { to { opacity: 0; transform: scale(.96); } }\n.sc-leaving { animation: sc-out .5s ease forwards; pointer-events: none; }\n\n/* 標題 */\n.sc-title { text-align: center; }\n.sc-title h1 { font-size: 36px; letter-spacing: .15em; margin: 0 0 6px; }\n.sc-title p { color: #aab; margin: 0 0 28px; }\n.sc-title .row { display: flex; gap: 10px; justify-content: center; }\n\n/* 開場 */\n.sc-opening { flex-direction: column; background: #000; cursor: pointer; }\n.sc-opening .line { max-width: 520px; font-size: 24px; line-height: 1.8; text-align: center; min-height: 3.6em; animation: sc-fade .8s ease both; }\n.sc-opening .line.hot { color: var(--accent); font-weight: 700; }\n.sc-opening .hint { position: fixed; bottom: 18px; color: #667; font-size: 12px; }\n.sc-opening .skip { position: fixed; top: 12px; right: 12px; font-size: 12px; padding: 4px 10px; }\n.sc-note { background: #f6e27a; color: #3a2e00; width: 280px; padding: 18px 16px 14px; box-shadow: 4px 4px 0 #000; font-size: 12px; line-height: 1.7; }\n.sc-note small { display: block; margin-top: 10px; opacity: .65; }\n.sc-note-wrap { display: flex; flex-direction: column; align-items: center; gap: 22px; }\n\n/* 死因卡 */\n.sc-death { background: rgba(6, 7, 10, .99); cursor: pointer; }\n.sc-card { position: relative; width: min(360px, 94vw); background: #f2ede0; color: #1b1a17; border: 4px solid #1b1a17; box-shadow: 0 0 0 3px #f2ede0, 8px 8px 0 #000; padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 10px; }\n.sc-card .no { display: flex; justify-content: space-between; font: 12px/1.5 var(--font); letter-spacing: .08em; }\n.sc-card .art-box { border: 3px solid #1b1a17; width: 190px; align-self: center; }\n.sc-card .ttl { font-size: 12px; color: #6b665a; text-align: center; }\n.sc-card .big { font-size: 24px; font-weight: 800; line-height: 1.45; text-align: center; margin: 2px 0; }\n.sc-card .tip { font-size: 12px; border-top: 2px dashed #b9b2a0; padding-top: 8px; }\n.sc-card .corner { font-size: 12px; color: #6b665a; }\n.sc-card .cost { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #a31d22; }\n.sc-card .retry { text-align: center; font-weight: 700; font-size: 12px; background: #1b1a17; color: #f2ede0; padding: 8px; }\n.sc-stamp { position: absolute; top: 40px; right: -10px; background: var(--danger); color: #fff; font: 12px/1.5 var(--font); padding: 5px 10px; border: 3px solid #fff; letter-spacing: .1em; z-index: 2; }\n.sc-senpai { align-self: center; width: 92%; background: #f6e27a; color: #3a2e00; padding: 8px 10px; font-size: 12px; line-height: 1.55; box-shadow: 3px 3px 0 #000; }\n\n/* 圖鑑 */\n.sc-codex { align-items: flex-start; }\n.sc-codex-box { width: min(920px, 100%); margin: auto; }\n.sc-codex-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }\n.sc-codex-head h2 { margin: 0; font-size: 24px; flex: 1; }\n.sc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 8px; }\n.sc-cell { background: #1f232d; border: 2px solid var(--line); border-radius: 0; padding: 6px; text-align: left; display: flex; flex-direction: column; gap: 4px; min-height: 150px; }\n.sc-cell.on { background: #262b38; }\n.sc-cell.sel { border-color: var(--accent); }\n.sc-cell .n { font: 12px/1.5 var(--font); color: #99a; }\n.sc-cell .t { font-size: 12px; line-height: 1.35; }\n.sc-cell.off .t { color: #667; }\n.sc-cell .end { color: var(--accent); }\n.sc-detail { margin-top: 10px; background: #1f232d; border: 2px solid var(--line); border-radius: 0; padding: 10px 12px; min-height: 84px; line-height: 1.6; white-space: pre-line; }\n.sc-detail b { color: var(--accent); }\n\n/* 結局與結算 */\n.sc-ending { flex-direction: column; gap: 12px; text-align: center; }\n.sc-ending .art-wrap { width: min(220px, 60vw, 32vh); border: 4px solid #e8e8ee; position: relative; }\n.sc-ending h2 { font-size: 24px; margin: 0; letter-spacing: .08em; }\n.sc-ending .no { font: 12px/1.5 var(--font); color: #99a; }\n.sc-ending .lines { max-width: 520px; font-size: 12px; line-height: 1.9; }\n.sc-ending .lines p { margin: 0 0 4px; opacity: 0; animation: sc-fade .7s ease forwards; }\n.sc-ending .later { opacity: 0; animation: sc-fade .7s ease forwards; }\n.sc-ending .art-wrap .sc-stamp { top: -14px; right: -22px; }\n.sc-results { width: min(440px, 94vw); background: #1f232d; border: 2px solid var(--line); border-radius: 0; padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; }\n.sc-results h2 { margin: 0 0 4px; text-align: center; }\n.sc-results .row { display: flex; justify-content: space-between; border-bottom: 1px solid var(--line); padding-bottom: 6px; }\n.sc-results .row b { color: var(--accent); }\n.sc-results .joke { font-size: 12px; color: #c9c9d4; line-height: 1.65; margin: 0; }\n.sc-results .btns { display: flex; gap: 10px; justify-content: center; margin-top: 8px; }\n.sc-finale { flex-direction: column; gap: 22px; text-align: center; }\n.sc-finale p { font-size: 24px; max-width: 480px; line-height: 1.8; margin: 0; }\n.sc-finale .row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }\n\n/* ---------- 氣氛（WP11）：開場群組聊天、死因卡演出 ---------- */\n.sc-phone { width: min(340px, 90vw); height: min(520px, 76vh); background: #8fa6c9; border: 6px solid #1b1d24; border-radius: 0; box-shadow: 6px 6px 0 #000; display: flex; flex-direction: column; overflow: hidden; animation: sc-fade .5s ease both; }\n.sc-phone-time { background: #1b1d24; color: #ddd; font: 12px/1.5 var(--font); text-align: center; padding: 6px 0 4px; }\n.sc-phone-head { background: #283048; color: #fff; font-weight: 700; padding: 8px 12px; font-size: 12px; }\n.sc-phone-list { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }\n.sc-msg { display: flex; flex-direction: column; align-items: flex-start; max-width: 80%; animation: sc-pop .25s ease both; }\n.sc-msg .from { font-size: 12px; color: #22283a; margin: 0 0 2px 4px; }\n.sc-msg .note { font-size: 12px; color: #3a425a; background: rgba(255, 255, 255, .45); border-radius: 0; padding: 1px 6px; margin-bottom: 3px; }\n.sc-msg .bubble { background: #fff; color: #111; border-radius: 0; padding: 6px 11px; font-size: 12px; line-height: 1.4; }\n.sc-msg.me { align-self: flex-end; align-items: flex-end; }\n.sc-msg.me .bubble { background: #8de055; }\n.sc-msg.sys { align-self: flex-end; max-width: none; }\n.sc-msg.sys .bubble { background: none; color: #22283a; font-size: 12px; padding: 0 4px; }\n@keyframes sc-pop { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }\n\n.sc-death .sc-card { animation: sc-slam .42s cubic-bezier(.2, 1.6, .4, 1) both; }\n@keyframes sc-slam { 0% { opacity: 0; transform: translateY(-60px); } 70% { opacity: 1; transform: translateY(4px); } 100% { transform: none; } }\n.sc-flash { position: fixed; inset: 0; background: #e5484d; pointer-events: none; animation: sc-flash .45s ease-out forwards; }\n@keyframes sc-flash { 0% { opacity: .55; } 100% { opacity: 0; } }\n.sc-card .big { min-height: 2.9em; }\n.sc-card .sc-stamp, .sc-ending .sc-stamp { animation: sc-stamp .35s .5s cubic-bezier(.3, 1.8, .5, 1) both; }\n@keyframes sc-stamp { 0% { opacity: 0; transform: translateY(-12px); } 100% { opacity: 1; transform: none; } }\n","game/ui/world/world.css":"/* WP2 走動畫面樣式：全部掛在 #world-root 底下 */\n#app.wd-solo { grid-template-columns: 1fr; }\n#world-root { position: relative; }\n.wd { position: relative; display: flex; flex-direction: column; align-items: center; padding: 8px; outline: none; }\n.wd-room { font-weight: 600; color: var(--accent); margin-bottom: 6px; }\n.wd-stage { position: relative; line-height: 0; }\n.wd-canvas { image-rendering: pixelated; image-rendering: crisp-edges; display: block; border: 2px solid var(--line); background: #0d0e13; }\n.wd-help { margin-top: 6px; font-size: 12px; color: #8a90a4; }\n.wd-prompt { position: absolute; transform: translate(-50%, -100%); background: rgba(10, 11, 16, .92); color: #fff; border: 2px solid var(--accent); border-radius: 0; padding: 1px 8px; font-size: 12px; line-height: 1.5; white-space: nowrap; pointer-events: none; opacity: 0; visibility: hidden; transition: opacity .1s, visibility .1s; z-index: 2; }\n.wd-prompt.on { opacity: 1; visibility: visible; }\n.wd-toast { position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%); max-width: 90%; background: rgba(10, 11, 16, .94); color: #fff; border: 2px solid var(--line); border-radius: 0; padding: 6px 12px; font-size: 12px; line-height: 1.5; text-align: center; opacity: 0; visibility: hidden; transition: opacity .25s, visibility .25s; pointer-events: none; z-index: 3; }\n.wd-toast.on { opacity: 1; visibility: visible; }\n.wd-panel-btn { position: absolute; top: 8px; right: 8px; font-size: 12px; }\n.wd-modal { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(6, 7, 10, .55); z-index: 5; }\n.wd-card { background: var(--panel); border: 2px solid var(--accent); border-radius: 0; padding: 14px 18px; max-width: 420px; }\n.wd-card p { margin: 8px 0 12px; white-space: pre-line; }\n.wd-row { display: flex; gap: 8px; flex-wrap: wrap; }\n.wd-row button { padding: 6px 12px; }\n.wd-row button.primary { background: var(--accent); color: #1a1405; border-color: var(--accent); font-weight: 700; }\n/* 換房間：黑一下再亮 */\n.wd-stage::after { content: ''; position: absolute; inset: 0; background: #000; opacity: 0; pointer-events: none; }\n.wd-stage.wd-fade::after { animation: wd-fade .32s ease-out; }\n@keyframes wd-fade { 0% { opacity: 1; } 100% { opacity: 0; } }\n"};
const __defs = Object.create(null);
const __cache = Object.create(null);
function __def(id, fn) { __defs[id] = fn; }
function __require(id) {
  if (id in __cache) return __cache[id].exports;
  if (!__defs[id]) throw new Error('找不到模組：' + id);
  const mod = { exports: {} };
  __cache[id] = mod;
  __defs[id](__require, mod.exports);
  return mod.exports;
}

__def("game/core/save.js", function (__require, __exports) {
// 存檔與圖鑑。storage 介面同 localStorage：getItem / setItem / removeItem。
// 每次讀寫都包 try/catch，私密視窗或被封鎖時遊戲照樣能玩，只是不會記住。

const KEY_CODEX = 'latia-mid:codex:v1';
const KEY_RUN = 'latia-mid:run:v1';

function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
  };
}

/** 瀏覽器用：拿得到 localStorage 就用，拿不到就退回記憶體。 */
function browserStorage() {
  try {
    const s = globalThis.localStorage;
    const probe = '__latia_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return memoryStorage();
  }
}

function readJSON(storage, key) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* 存不了就算了 */
  }
}

function createSave(storage = memoryStorage()) {
  const emptyCodex = () => ({ deaths: {}, endings: {} });
  return {
    loadCodex() {
      const c = readJSON(storage, KEY_CODEX);
      return c && c.deaths && c.endings ? c : emptyCodex();
    },
    /** 記一筆；回傳是不是第一次拿到。kind: 'deaths' | 'endings' */
    record(kind, id) {
      const c = this.loadCodex();
      const isNew = !c[kind][id];
      c[kind][id] = (c[kind][id] || 0) + 1;
      writeJSON(storage, KEY_CODEX, c);
      return isNew;
    },
    writeCodex(c) {
      writeJSON(storage, KEY_CODEX, c);
    },
    loadRun() {
      return readJSON(storage, KEY_RUN);
    },
    saveRun(state) {
      writeJSON(storage, KEY_RUN, state);
    },
    clearRun() {
      try {
        storage.removeItem(KEY_RUN);
      } catch {
        /* ignore */
      }
    },
  };
}

__exports.memoryStorage = memoryStorage;
__exports.browserStorage = browserStorage;
__exports.createSave = createSave;
__exports.KEY_CODEX = KEY_CODEX;
__exports.KEY_RUN = KEY_RUN;

});

__def("game/core/engine.js", function (__require, __exports) {
// 遊戲規則核心：狀態機、謎題判定、死法、時間、提示、結局。
// 不碰 DOM / Canvas。畫面層只透過 dispatch(action) 和讀取函式跟它互動。

const { createSave } = __require("game/core/save.js");

const PHASE = Object.freeze({
  PLAYING: 'playing', // 正常遊玩
  DEAD: 'dead', // 死因卡顯示中，等 RETRY
  FINALE: 'finale', // 走出大門，等玩家選「回家」或「點開未讀」
  ENDING: 'ending', // 結局畫面，等 NEW_RUN
});

const STATE_VERSION = 1;

function initialState(content) {
  const puzzles = {};
  for (const p of content.puzzles) {
    puzzles[p.id] = { stage: 0, wrong: 0, solved: false, deaths: 0, hintLevel: 0 };
  }
  return {
    v: STATE_VERSION,
    phase: PHASE.PLAYING,
    clock: content.texts.clock.start,
    room: content.rooms.start,
    puzzles,
    items: [],
    flags: {},
    deaths: 0,
    lastDeath: null,
    ending: null,
    aiQuota: content.hints.aiQuota,
    doorLocked: false,
  };
}

function formatClock(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** 某一步的正解（給測試與除錯「自動解這一步」用）。 */
function solutionFor(stage) {
  if (stage.type === 'choice') return stage.options.find((o) => o.outcome === 'next').id;
  return stage.answer;
}

const sameList = (a, b) => Array.isArray(a) && a.length === b.length && a.every((x, i) => x === b[i]);
const sameSet = (a, b) => Array.isArray(a) && sameList([...new Set(a)].sort(), [...b].sort());

function isValidState(s, content) {
  return (
    s && s.v === STATE_VERSION && s.puzzles &&
    content.puzzles.every((p) => s.puzzles[p.id]) && Object.values(PHASE).includes(s.phase)
  );
}

/**
 * @param {object} content  buildContent() 的結果
 * @param {{ storage?: Storage, resume?: boolean, debug?: boolean }} [opts]
 */
function createGame(content, opts = {}) {
  const save = createSave(opts.storage);
  const { clock: clockRule } = content.texts;
  let state = initialState(content);
  if (opts.resume !== false) {
    const saved = save.loadRun();
    if (isValidState(saved, content)) state = saved;
  }

  // ---------- 查詢 ----------
  const hasItem = (id) => state.items.includes(id);
  const isSolved = (pid) => state.puzzles[pid]?.solved === true;
  const meets = (req = {}) =>
    (req.items || []).every(hasItem) && (req.puzzles || []).every(isSolved) &&
    (req.flags || []).every((f) => state.flags[f]);

  function puzzleAvailable(pid) {
    const p = content.puzzleById[pid];
    return !!p && !isSolved(pid) && p.requires.every(isSolved);
  }

  /** 目前該做的主線謎題（提示、任務欄用）。p7、p8 同時開放時優先 p7。 */
  function currentPuzzle() {
    return content.puzzles.find((p) => puzzleAvailable(p.id)) || null;
  }

  function currentStage(pid) {
    const p = content.puzzleById[pid];
    return p ? p.stages[state.puzzles[pid].stage] || null : null;
  }

  function canEnter(roomId) {
    const room = content.rooms.byId[roomId];
    return !!room && meets(room.requires);
  }

  function codex() {
    const c = save.loadCodex();
    const entries = [
      ...content.deaths.map((d) => ({ no: d.no, kind: 'death', id: d.id, title: d.title, origin: d.origin, found: !!c.deaths[d.id], text: c.deaths[d.id] ? d.text : null })),
      ...content.endings.map((e) => ({ no: e.no, kind: 'ending', id: e.id, title: e.title, found: !!c.endings[e.id], text: c.endings[e.id] ? e.lines.join('\n') : null })),
    ].sort((a, b) => a.no - b.no);
    return { entries, found: entries.filter((e) => e.found).length, total: entries.length };
  }

  /** 真結局門檻：圖鑑收集到 trueEndingCodexRequired 格，手機那則未讀才點得開。 */
  function trueEndingGate() {
    const required = content.trueEndingCodexRequired;
    const found = codex().found;
    return { unreadReady: found >= required, found, required };
  }

  function results() {
    const cx = codex();
    const lines = [content.texts.results.peerReview];
    if (state.flags.p7_remembered) lines.push(content.texts.results.rememberedAccount);
    if (isSolved('p7')) lines.push(content.texts.results.passwordCorner);
    return { clock: formatClock(state.clock), deaths: state.deaths, codexFound: cx.found, codexTotal: cx.total, lines };
  }

  // ---------- 狀態變更 ----------
  function die(deathId, events) {
    const d = content.deathById[deathId];
    state.phase = PHASE.DEAD;
    state.lastDeath = deathId;
    state.deaths += 1;
    state.clock += clockRule.perDeath;
    const isNew = save.record('deaths', deathId);
    const corners = content.texts.deathCardCorner;
    const ev = { type: 'death', death: d, isNew, clock: formatClock(state.clock), corner: corners[(state.deaths - 1) % corners.length] };
    const pState = state.puzzles[d.origin];
    if (pState) {
      pState.deaths += 1;
      if (pState.deaths % content.hints.senpaiAfterDeaths === 0) {
        ev.senpai = `${content.hints.puzzles[d.origin].senpai}${content.hints.senpaiSignature}`;
      }
    }
    events.push(ev);
  }

  function end(endingId, events) {
    state.phase = PHASE.ENDING;
    state.ending = endingId;
    const isNew = save.record('endings', endingId);
    events.push({ type: 'ending', ending: content.endingById[endingId], isNew, results: results() });
  }

  function solve(p, events) {
    const ps = state.puzzles[p.id];
    ps.solved = true;
    state.clock += clockRule.perSolve;
    for (const it of p.reward.items) {
      if (!hasItem(it)) {
        state.items.push(it);
        events.push({ type: 'item', item: it });
      }
    }
    for (const f of p.reward.flags) state.flags[f] = true;
    events.push({ type: 'solved', puzzle: p.id, clock: formatClock(state.clock) });
    if (p.onSolve === 'exit') {
      if (state.flags.submitted) {
        state.phase = PHASE.FINALE;
        events.push({ type: 'finale', text: content.texts.finale, ...trueEndingGate() });
      } else {
        end('end_no_submit', events);
      }
      return;
    }
    if (state.clock >= clockRule.dawn) end('end_dawn', events);
  }

  function advance(p, message, events) {
    const ps = state.puzzles[p.id];
    const stage = p.stages[ps.stage];
    ps.wrong = 0;
    events.push({ type: 'stage_cleared', puzzle: p.id, stage: stage.id, message: message || null });
    ps.stage += 1;
    if (ps.stage >= p.stages.length) solve(p, events);
    else events.push({ type: 'stage', puzzle: p.id, stage: p.stages[ps.stage].id });
  }

  function handlePuzzle(pid, value, events) {
    const p = content.puzzleById[pid];
    if (!p) return events.push({ type: 'error', reason: 'unknown_puzzle' });
    if (isSolved(pid)) return events.push({ type: 'error', reason: 'already_solved' });
    if (!puzzleAvailable(pid)) return events.push({ type: 'error', reason: 'locked' });
    if (pid === 'p1' && !state.doorLocked) {
      state.doorLocked = true;
      events.push({ type: 'cutscene', id: 'guard_locks', lines: content.texts.guardLocks });
    }
    const ps = state.puzzles[pid];
    const s = p.stages[ps.stage];
    const wrong = () => {
      ps.wrong += 1;
      if (s.maxWrong && ps.wrong >= s.maxWrong) {
        ps.wrong = 0;
        return die(s.wrongDeath, events);
      }
      events.push({ type: 'wrong', puzzle: pid, stage: s.id, message: s.wrongMessage || null, wrongCount: ps.wrong });
    };

    switch (s.type) {
      case 'code': {
        const answer = typeof value === 'object' && value !== null ? value.answer : value;
        if (String(answer ?? '').trim() !== String(s.answer)) return wrong();
        const checks = (typeof value === 'object' && value?.checks) || {};
        for (const c of s.checks || []) if (checks[c.id] && c.setsFlag) state.flags[c.setsFlag] = true;
        return advance(p, s.successMessage, events);
      }
      case 'wheel':
      case 'sequence':
        return sameList(value, s.answer) ? advance(p, s.successMessage, events) : wrong();
      case 'toggles':
        return sameSet(value, s.answer) ? advance(p, s.successMessage, events) : wrong();
      case 'select': {
        const v = value || {};
        const rule = (s.deathRules || []).find((r) => Object.entries(r.match).every(([k, x]) => v[k] === x));
        if (rule) return die(rule.death, events);
        const ok = Object.entries(s.answer).every(([k, x]) => v[k] === x);
        return ok ? advance(p, s.successMessage, events) : wrong();
      }
      case 'choice': {
        const o = s.options.find((x) => x.id === value);
        if (!o) return events.push({ type: 'error', reason: 'unknown_option' });
        if (o.outcome === 'death') return die(o.death, events);
        if (o.outcome === 'stay') return events.push({ type: 'message', text: o.message || '' });
        return advance(p, o.message, events);
      }
      default:
        return events.push({ type: 'error', reason: 'unknown_stage_type' });
    }
  }

  function handleHint(events) {
    const p = currentPuzzle();
    if (!p) return events.push({ type: 'hint', text: null });
    const ps = state.puzzles[p.id];
    const list = content.hints.puzzles[p.id].ai;
    // 這關的提示都給過了：重講最後一句，不再扣額度（不然第 3 次會白白浪費掉）
    if (ps.hintLevel >= list.length) {
      return events.push({ type: 'hint', puzzle: p.id, text: list[list.length - 1], quotaOut: false, quota: state.aiQuota, repeat: true });
    }
    if (state.aiQuota <= 0) return events.push({ type: 'hint', puzzle: p.id, text: content.hints.aiQuotaOutText, quotaOut: true, quota: 0 });
    state.aiQuota -= 1;
    const text = list[Math.min(ps.hintLevel, list.length - 1)];
    ps.hintLevel += 1;
    events.push({ type: 'hint', puzzle: p.id, text, quotaOut: false, quota: state.aiQuota });
  }

  // ---------- 除錯 ----------
  function handleDebug(action, events) {
    if (!opts.debug) return events.push({ type: 'error', reason: 'debug_disabled' });
    switch (action.type) {
      case 'DEBUG_JUMP': {
        const target = content.puzzleById[action.puzzle];
        if (!target) return events.push({ type: 'error', reason: 'unknown_puzzle' });
        state = initialState(content);
        state.doorLocked = true;
        let n = 0;
        for (const p of content.puzzles) {
          if (p.order >= target.order) break;
          state.puzzles[p.id].solved = true;
          state.puzzles[p.id].stage = p.stages.length;
          for (const it of p.reward.items) if (!hasItem(it)) state.items.push(it);
          for (const f of p.reward.flags) state.flags[f] = true;
          n += 1;
        }
        state.clock = clockRule.start + clockRule.perSolve * n;
        state.room = target.room;
        return events.push({ type: 'debug', did: 'jump', puzzle: target.id });
      }
      case 'DEBUG_DEATH':
        if (!content.deathById[action.death]) return events.push({ type: 'error', reason: 'unknown_death' });
        return die(action.death, events);
      case 'DEBUG_ENDING':
        if (!content.endingById[action.ending]) return events.push({ type: 'error', reason: 'unknown_ending' });
        return end(action.ending, events);
      case 'DEBUG_UNLOCK_ALL': {
        const c = save.loadCodex();
        for (const d of content.deaths) c.deaths[d.id] = c.deaths[d.id] || 1;
        for (const e of content.endings) c.endings[e.id] = c.endings[e.id] || 1;
        save.writeCodex(c);
        return events.push({ type: 'debug', did: 'unlock_all' });
      }
      case 'DEBUG_CLOCK':
        state.clock = Number(action.clock);
        return events.push({ type: 'debug', did: 'clock', clock: formatClock(state.clock) });
      case 'DEBUG_SOLVE_STAGE': {
        const p = currentPuzzle();
        if (!p) return events.push({ type: 'error', reason: 'nothing_to_solve' });
        return handlePuzzle(p.id, solutionFor(currentStage(p.id)), events);
      }
      default:
        return events.push({ type: 'error', reason: 'unknown_action' });
    }
  }

  // ---------- 入口 ----------
  const PLAYING_ONLY = new Set(['GO', 'DOOR', 'PUZZLE', 'EGG', 'HINT', 'PHONE']);

  function dispatch(action) {
    const events = [];
    const t = action?.type;
    if (PLAYING_ONLY.has(t) && state.phase !== PHASE.PLAYING) {
      events.push({ type: 'error', reason: 'wrong_phase', phase: state.phase });
      return events;
    }
    switch (t) {
      case 'NEW_RUN':
        state = initialState(content);
        events.push({ type: 'new_run', opening: content.texts.opening, tutorialNote: content.texts.tutorialNote });
        break;
      case 'GO':
        if (!content.rooms.byId[action.room]) events.push({ type: 'error', reason: 'unknown_room' });
        else if (!canEnter(action.room)) events.push({ type: 'blocked', room: action.room, requires: content.rooms.byId[action.room].requires });
        else {
          state.room = action.room;
          events.push({ type: 'moved', room: action.room });
        }
        break;
      case 'DOOR':
        if (state.doorLocked) events.push({ type: 'message', text: content.texts.doorLocked });
        else die('d_door', events); // 門其實沒鎖：記一筆死法，重來後繼續玩
        break;
      case 'PUZZLE':
        handlePuzzle(action.puzzle, action.value, events);
        break;
      case 'EGG': {
        const egg = content.eggById[action.egg];
        if (!egg) events.push({ type: 'error', reason: 'unknown_egg' });
        else die(egg.death, events);
        break;
      }
      case 'HINT':
        handleHint(events);
        break;
      case 'PHONE':
        events.push({ type: 'message', text: content.texts.phoneTapDuringNight });
        break;
      case 'RETRY':
        if (state.phase !== PHASE.DEAD) {
          events.push({ type: 'error', reason: 'wrong_phase', phase: state.phase });
          break;
        }
        if (state.clock >= clockRule.dawn) end('end_dawn', events);
        else {
          state.phase = PHASE.PLAYING;
          events.push({ type: 'retry', clock: formatClock(state.clock) });
        }
        break;
      case 'FINALE':
        if (state.phase !== PHASE.FINALE) events.push({ type: 'error', reason: 'wrong_phase', phase: state.phase });
        else if (action.choice === 'unread') {
          const gate = trueEndingGate();
          if (gate.unreadReady) end('end_true', events);
          else {
            const f = content.texts.finale;
            events.push({
              type: 'finale_locked',
              text: f.unreadLocked,
              hint: f.unreadLockedHint.replace('{required}', gate.required).replace('{found}', gate.found),
              ...gate,
            });
          }
        }
        else if (action.choice === 'home') end('end_normal', events);
        else events.push({ type: 'error', reason: 'unknown_choice' });
        break;
      default:
        if (typeof t === 'string' && t.startsWith('DEBUG_')) handleDebug(action, events);
        else events.push({ type: 'error', reason: 'unknown_action' });
    }
    save.saveRun(state);
    return events;
  }

  return {
    dispatch,
    getState: () => structuredClone(state),
    currentPuzzle,
    currentStage,
    puzzleAvailable,
    canEnter,
    hasItem,
    isSolved,
    codex,
    results,
    trueEndingGate,
    clockText: () => formatClock(state.clock),
    content,
  };
}

__exports.initialState = initialState;
__exports.formatClock = formatClock;
__exports.solutionFor = solutionFor;
__exports.createGame = createGame;
__exports.PHASE = PHASE;
__exports.STATE_VERSION = STATE_VERSION;

});

__def("game/core/content.js", function (__require, __exports) {
// 資料檔的整理與檢查。不依賴瀏覽器或 Node 專屬 API。

const CONTENT_FILES = ['puzzles', 'deaths', 'eggs', 'endings', 'rooms', 'hints', 'texts', 'moodle'];

const STAGE_TYPES = ['code', 'wheel', 'sequence', 'toggles', 'select', 'choice'];

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

/**
 * 把各資料檔的原始 JSON 組成核心要用的 content 物件。
 * @param {Record<string, any>} raw  key 是 CONTENT_FILES 裡的名字，value 是該檔的 JSON
 */
function buildContent(raw) {
  for (const name of CONTENT_FILES) {
    if (!raw[name]) throw new Error(`缺少資料檔：${name}.json`);
  }
  const puzzles = [...raw.puzzles.puzzles].sort((a, b) => a.order - b.order);
  const deaths = raw.deaths.deaths;
  const eggs = raw.eggs.eggs;
  const endings = raw.endings.endings;
  const roomList = raw.rooms.rooms;
  return {
    puzzles,
    puzzleById: byId(puzzles),
    deaths,
    deathById: byId(deaths),
    eggs,
    eggById: byId(eggs),
    endings,
    endingById: byId(endings),
    trueEndingCodexRequired: raw.endings.trueEndingCodexRequired ?? 0,
    rooms: { start: raw.rooms.start, list: roomList, byId: byId(roomList) },
    hints: raw.hints,
    texts: raw.texts,
    moodle: raw.moodle,
  };
}

/** 回傳錯誤訊息陣列；空陣列代表資料檔沒問題。 */
function validateContent(c) {
  const errors = [];
  const err = (m) => errors.push(m);
  const dupCheck = (list, label) => {
    const seen = new Set();
    for (const x of list) {
      if (seen.has(x.id)) err(`${label} id 重複：${x.id}`);
      seen.add(x.id);
    }
  };
  dupCheck(c.puzzles, '謎題');
  dupCheck(c.deaths, '死法');
  dupCheck(c.eggs, '彩蛋');
  dupCheck(c.endings, '結局');
  dupCheck(c.rooms.list, '房間');

  if (c.puzzles.length !== 8) err(`主線謎題應為 8 關，目前 ${c.puzzles.length}`);
  c.puzzles.forEach((p, i) => {
    if (p.order !== i + 1) err(`謎題 order 應連續：${p.id}`);
  });
  if (c.eggs.length !== 20) err(`彩蛋物件應為 20 個，目前 ${c.eggs.length}`);

  const referenced = new Map(); // deathId -> origin
  const ref = (deathId, origin, where) => {
    if (!c.deathById[deathId]) return err(`${where} 指到不存在的死法：${deathId}`);
    if (referenced.has(deathId)) err(`死法被引用兩次：${deathId}`);
    referenced.set(deathId, origin);
  };

  const rewardItems = new Set();
  for (const p of c.puzzles) {
    if (!c.rooms.byId[p.room]) err(`${p.id} 的房間不存在：${p.room}`);
    for (const r of p.requires) if (!c.puzzleById[r]) err(`${p.id} 依賴不存在的謎題：${r}`);
    if (!c.hints.puzzles[p.id]) err(`${p.id} 沒有提示`);
    for (const it of p.reward.items) rewardItems.add(it);
    if (!p.stages.length) err(`${p.id} 沒有任何步驟`);
    for (const s of p.stages) {
      const where = `${p.id}.${s.id}`;
      if (!STAGE_TYPES.includes(s.type)) err(`${where} 未知的步驟類型：${s.type}`);
      if (s.type === 'choice') {
        if (!s.options.some((o) => o.outcome === 'next')) err(`${where} 沒有正解選項`);
        for (const o of s.options) {
          if (!['next', 'death', 'stay'].includes(o.outcome)) err(`${where}.${o.id} 未知 outcome`);
          if (o.outcome === 'death') ref(o.death, p.id, `${where}.${o.id}`);
        }
      } else if (s.answer === undefined) {
        err(`${where} 沒有 answer`);
      }
      if (s.wrongDeath) ref(s.wrongDeath, p.id, where);
      for (const r of s.deathRules || []) ref(r.death, p.id, where);
      if (s.type === 'wheel') {
        s.answer.forEach((a, i) => { if (!s.wheels[i]?.includes(a)) err(`${where} 第 ${i + 1} 個滾輪沒有答案字`); });
      }
      if (s.type === 'sequence') {
        const ids = new Set(s.buttons.map((b) => b.id));
        for (const a of s.answer) if (!ids.has(a)) err(`${where} 答案按鈕不存在：${a}`);
      }
      if (s.type === 'toggles') {
        for (const a of s.answer) if (!s.switches.includes(a)) err(`${where} 答案開關不存在：${a}`);
      }
      if (s.type === 'select') {
        for (const f of s.fields) {
          if (!f.options.some((o) => o.id === s.answer[f.id])) err(`${where} 欄位 ${f.id} 的答案不在選項裡`);
        }
      }
    }
  }
  // 401 的門：警衛鎖門前推門出去（核心的 DOOR 動作）
  if (c.deathById.d_door) ref('d_door', 'r401', '401 的門');
  else err('缺少死法 d_door（門其實沒鎖）');
  for (const e of c.eggs) {
    if (!c.rooms.byId[e.room]) err(`彩蛋 ${e.id} 的房間不存在：${e.room}`);
    ref(e.death, e.room, `彩蛋 ${e.id}`);
  }
  for (const d of c.deaths) {
    const origin = referenced.get(d.id);
    if (origin === undefined) err(`死法沒有任何觸發點：${d.id}`);
    else if (origin !== d.origin) err(`死法 ${d.id} 的 origin 應為 ${origin}，寫的是 ${d.origin}`);
    if (!d.text) err(`死法 ${d.id} 沒有死因文字`);
  }
  for (const room of c.rooms.list) {
    for (const it of room.requires.items || []) if (!rewardItems.has(it)) err(`房間 ${room.id} 需要拿不到的道具：${it}`);
    for (const pid of room.requires.puzzles || []) if (!c.puzzleById[pid]) err(`房間 ${room.id} 依賴不存在的謎題：${pid}`);
    for (const ex of room.exits) if (!c.rooms.byId[ex]) err(`房間 ${room.id} 的出口不存在：${ex}`);
  }
  if (!c.rooms.byId[c.rooms.start]) err('起始房間不存在');

  const nos = new Set();
  for (const x of [...c.deaths, ...c.endings]) {
    if (nos.has(x.no)) err(`圖鑑編號重複：${x.no}`);
    nos.add(x.no);
  }
  if (c.deathById.d_door?.no !== 1) err('「門其實沒鎖」必須是圖鑑第 1 格');
  for (const id of ['end_dawn', 'end_no_submit', 'end_normal', 'end_true']) {
    if (!c.endingById[id]) err(`缺少結局：${id}`);
  }
  const req = c.trueEndingCodexRequired;
  const total = c.deaths.length + c.endings.length;
  if (!Number.isInteger(req) || req < 0 || req >= total) err(`trueEndingCodexRequired 應為 0～${total - 1} 的整數，目前 ${req}`);
  const omens = c.deaths.filter((d) => d.omen);
  if (omens.length > 3) err(`預兆最多 3 個，目前 ${omens.length}`);
  return errors;
}

__exports.buildContent = buildContent;
__exports.validateContent = validateContent;
__exports.CONTENT_FILES = CONTENT_FILES;
__exports.STAGE_TYPES = STAGE_TYPES;

});

__def("game/core/debug.js", function (__require, __exports) {
// 把除錯網址參數轉成 dispatch 動作。畫面層在 ?debug=1 時呼叫。
//   ?debug=1&jump=p5        跳到第 5 關（前面都算解完）
//   ?debug=1&death=d_p8_dinner  直接觸發某個死法
//   ?debug=1&ending=end_true    直接看某個結局
//   ?debug=1&unlock=all     解鎖全部圖鑑
//   ?debug=1&clock=400      把時鐘設成 06:40（分鐘數）

function isDebug(params) {
  return params.get('debug') === '1';
}

function debugActions(params) {
  if (!isDebug(params)) return [];
  const actions = [];
  if (params.get('unlock') === 'all') actions.push({ type: 'DEBUG_UNLOCK_ALL' });
  if (params.get('jump')) actions.push({ type: 'DEBUG_JUMP', puzzle: params.get('jump') });
  if (params.get('clock')) actions.push({ type: 'DEBUG_CLOCK', clock: Number(params.get('clock')) });
  if (params.get('death')) actions.push({ type: 'DEBUG_DEATH', death: params.get('death') });
  if (params.get('ending')) actions.push({ type: 'DEBUG_ENDING', ending: params.get('ending') });
  return actions;
}

__exports.isDebug = isDebug;
__exports.debugActions = debugActions;

});

__def("game/core/load-browser.js", function (__require, __exports) {
const { buildContent } = __require("game/core/content.js");
async function loadContent() { return buildContent(__RAW_CONTENT); }

__exports.loadContent = loadContent;

});

__def("game/core/index.js", function (__require, __exports) {
// 畫面層只需要從這裡 import。
__exports.createGame = __require("game/core/engine.js").createGame; __exports.initialState = __require("game/core/engine.js").initialState; __exports.formatClock = __require("game/core/engine.js").formatClock; __exports.solutionFor = __require("game/core/engine.js").solutionFor; __exports.PHASE = __require("game/core/engine.js").PHASE;
__exports.buildContent = __require("game/core/content.js").buildContent; __exports.validateContent = __require("game/core/content.js").validateContent; __exports.CONTENT_FILES = __require("game/core/content.js").CONTENT_FILES;
__exports.createSave = __require("game/core/save.js").createSave; __exports.memoryStorage = __require("game/core/save.js").memoryStorage; __exports.browserStorage = __require("game/core/save.js").browserStorage; __exports.KEY_CODEX = __require("game/core/save.js").KEY_CODEX; __exports.KEY_RUN = __require("game/core/save.js").KEY_RUN;
__exports.isDebug = __require("game/core/debug.js").isDebug; __exports.debugActions = __require("game/core/debug.js").debugActions;
__exports.loadContent = __require("game/core/load-browser.js").loadContent;



});

__def("game/ui/bus.js", function (__require, __exports) {
// 簡單的事件分發：on(type, fn)、emit(events)。type 用 '*' 可收全部事件。
const handlers = new Map();

/** 註冊處理函式，回傳取消註冊的函式。 */
function on(type, fn) {
  if (!handlers.has(type)) handlers.set(type, new Set());
  handlers.get(type).add(fn);
  return () => handlers.get(type).delete(fn);
}

/** 照順序分發事件陣列；單一處理函式出錯不影響其他人。最後送一個 _flush 讓畫面重畫。 */
function emit(events = []) {
  for (const ev of events) {
    for (const key of [ev.type, '*']) {
      for (const fn of handlers.get(key) ?? []) {
        try { fn(ev); } catch (e) { console.error(`[bus] ${ev.type} 處理失敗`, e); }
      }
    }
  }
  for (const fn of handlers.get('_flush') ?? []) {
    try { fn({ type: '_flush' }); } catch (e) { console.error('[bus] _flush 處理失敗', e); }
  }
}

__exports.on = on;
__exports.emit = emit;

});

__def("game/ui/rooms-panel.js", function (__require, __exports) {
// 不用走動的房間清單：列出房間與物件，點了就送動作（最短路徑用）。
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function initRoomsPanel(ctx, root) {
  const { game, content, bus, send } = ctx;
  const logLines = [];
  const log = (text, cls = '') => {
    logLines.push({ text, cls });
    if (logLines.length > 40) logLines.shift();
  };

  // 事件摘要，方便看動作有沒有送對
  bus.on('*', (ev) => {
    const { type, ...rest } = ev;
    log(`${type} ${JSON.stringify(rest)}`, type === 'error' ? 'err' : '');
  });
  bus.on('_flush', render);

  // 點到的物件：統一在這裡轉成動作或 UI 事件
  const act = {
    go: (room) => { log(`> GO ${room}`); send({ type: 'GO', room }); },
    door: () => { log('> DOOR'); send({ type: 'DOOR' }); },
    phone: () => { log('> PHONE'); send({ type: 'PHONE' }); },
    hint: () => { log('> HINT'); send({ type: 'HINT' }); },
    egg: (egg) => {
      const e = content.eggById[egg];
      if (confirm(`${e.name}\n${e.look}\n\n[確定] ${e.actionLabel}　[取消] 算了`)) {
        log(`> EGG ${egg}`);
        send({ type: 'EGG', egg });
      }
    },
    clue: (c) => alert(`${c.name}\n${c.text}`),
    puzzle: (p) => {
      if (game.puzzleAvailable(p.id)) {
        // 謎題介面（WP3）監聽這個事件；還沒做時只會留紀錄
        log(`> ui_open_puzzle ${p.id}`);
        bus.emit([{ type: 'ui_open_puzzle', puzzle: p.id }]);
      } else {
        const clues = content.rooms.list.flatMap((r) => r.clues).filter((c) => c.forPuzzle === p.id);
        alert('還不能解。相關線索：\n' + (clues.map((c) => `・${c.name}：${c.text}`).join('\n') || '（無）'));
      }
    },
  };

  const btn = (label, handler, { disabled = false, title = '' } = {}) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.disabled = disabled;
    if (title) b.title = title;
    b.addEventListener('click', handler);
    return b;
  };

  function render() {
    const st = game.getState();
    root.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'rp';
    wrap.innerHTML = `<h2>房間清單</h2><div class="status">階段 ${esc(st.phase)}｜時間 ${esc(game.clockText())}｜所在 ${esc(st.room)}｜死亡 ${st.deaths}｜AI 額度 ${st.aiQuota}</div>`;

    const top = document.createElement('div');
    top.append(
      btn('AI 助教', act.hint, { disabled: st.phase !== 'playing' }),
      ' ',
      btn('手機未讀', act.phone, { disabled: st.phase !== 'playing' }),
    );
    wrap.append(top);

    const playing = st.phase === 'playing';
    for (const room of content.rooms.list) {
      const sec = document.createElement('div');
      sec.className = 'room' + (room.id === st.room ? ' here' : '');
      const head = document.createElement('div');
      head.className = 'room-head';
      const ok = game.canEnter(room.id);
      head.append(`${room.name}${ok ? '' : '（鎖）'}`);
      if (room.id !== st.room) head.append(btn('前往', () => act.go(room.id), { disabled: !playing, title: ok ? '' : '會被擋下，可看 blocked 事件' }));
      sec.append(head);

      const ul = document.createElement('ul');
      const li = (b) => { const el = document.createElement('li'); el.append(b); ul.append(el); };
      if (room.id === 'r401') li(btn('門', act.door, { disabled: !playing }));
      for (const p of content.puzzles.filter((p) => p.room === room.id)) {
        const label = `${p.order}. ${p.title}（${p.object}）${game.isSolved(p.id) ? ' ✓' : ''}`;
        li(btn(label, () => act.puzzle(p), { disabled: !playing || game.isSolved(p.id) }));
      }
      for (const e of content.eggs.filter((e) => e.room === room.id)) li(btn(e.name, () => act.egg(e.id), { disabled: !playing }));
      for (const c of room.clues) li(btn(`📄 ${c.name}`, () => act.clue(c)));
      sec.append(ul);
      wrap.append(sec);
    }

    const h = document.createElement('h2');
    h.textContent = '事件紀錄';
    const logEl = document.createElement('div');
    logEl.className = 'log';
    for (const l of logLines) {
      const d = document.createElement('div');
      d.className = l.cls;
      d.textContent = l.text;
      logEl.append(d);
    }
    wrap.append(h, logEl);
    root.append(wrap);
    logEl.scrollTop = logEl.scrollHeight;
  }
}

__exports.initRoomsPanel = initRoomsPanel;

});

__def("game/ui/maps.js", function (__require, __exports) {
// 7 個房間的格子地圖與物件位置（WP2）。key 是房間 id，和 content/rooms.json 一致。
// 單位是格（TILE 像素）。tiles：'#' 牆、'.' 地板、'D' 門。物件 id 對應：
//   謎題 → puzzles.json 的 object；彩蛋 → eggs.json 的 id；線索 → rooms.json 的 clue id；
//   另外有 door（401 大門）、phone、hint。deco 是純裝飾（不能互動，會擋路）。
// 目前都是程式畫的佔位色塊，WP7 之後可換素材。
const TILE = 16;

// 物件：id、位置、顏色、圖示字（1 字）、寬高（格）、是否裝飾
const o = (id, x, y, color, icon, w = 1, h = 1) => ({ id, x, y, w, h, color, icon, solid: true, deco: false });
const deco = (id, x, y, color, w = 1, h = 1) => ({ id, x, y, w, h, color, icon: '', solid: true, deco: true });

// 依大小與門的位置產生外牆和地板；門在牆上，spawn 是門前面那一格
function room({ w, h, doors, objects, floor, wall }) {
  const grid = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => (x === 0 || y === 0 || x === w - 1 || y === h - 1 ? '#' : '.')));
  for (const d of doors) grid[d.y][d.x] = 'D';
  return { w, h, tiles: grid.map((r) => r.join('')), doors, objects, floor, wall };
}

const MAPS = {
  r401: room({
    w: 16, h: 11, floor: '#c9b48a', wall: '#6b5a45',
    doors: [{ x: 13, y: 10, to: 'hall' }],
    objects: [
      o('laptop', 3, 2, '#5b7fd1', '筆'),
      o('c_laptop_note', 4, 2, '#f2e07a', '條'),
      o('lectern', 7, 2, '#8a5a3c', '講', 2, 1),
      o('c_exam_calc', 2, 4, '#f0ece0', '考'),
      o('c_exam_stat', 4, 4, '#f0ece0', '考'),
      o('c_syllabus', 12, 0, '#d9d2b8', '綱'),
      o('c_whiteboard', 10, 0, '#f4f4f4', '白'),
      o('e_whiteboard_role', 6, 0, '#e8e8e8', '工'),
      o('e_timetable', 14, 0, '#a7c4a0', '課'),
      o('door', 1, 0, '#4a4a58', '門'),
      o('e_desk', 2, 6, '#9c7b57', '桌'),
      o('e_tablet', 5, 6, '#5a5f7a', '板'),
      o('e_exam', 8, 6, '#c8b6a6', '古'),
      o('e_citation', 11, 6, '#b5cfe0', '引'),
      o('phone', 12, 3, '#3ec28f', '機'),
      o('hint', 10, 3, '#f0b429', '助'),
      deco('deco_chair', 3, 3, '#7a6a52'),
    ],
  }),
  hall: room({
    w: 24, h: 9, floor: '#bfc3cc', wall: '#59607a',
    doors: [
      { x: 3, y: 0, to: 'r401' }, { x: 8, y: 0, to: 'pantry' }, { x: 14, y: 0, to: 'r503' }, { x: 20, y: 0, to: 'office' },
      { x: 5, y: 8, to: 'lab' }, { x: 18, y: 8, to: 'floor1' },
    ],
    objects: [
      o('switch_panel', 11, 0, '#d4c04a', '燈'),
      o('c_floorplan', 12, 0, '#7fb8d9', '圖'),
      o('c_plaque', 17, 0, '#c9a24a', '匾'),
      o('e_yearbook', 1, 3, '#e08bb0', '冊'),
      o('e_survey', 22, 3, '#8fd0c0', '問'),
      o('phone', 10, 5, '#3ec28f', '機'),
      o('hint', 13, 5, '#f0b429', '助'),
      deco('deco_bench', 6, 4, '#8a7a66', 3, 1),
      deco('deco_bench2', 16, 4, '#8a7a66', 3, 1),
    ],
  }),
  pantry: room({
    w: 14, h: 10, floor: '#d8c7b0', wall: '#7a6048',
    doors: [{ x: 2, y: 9, to: 'hall' }],
    objects: [
      o('vending', 10, 1, '#d94f4f', '販', 2, 1),
      o('c_pantry_board', 5, 0, '#f4f4f4', '板'),
      o('e_delivery', 2, 3, '#f09a3e', '送'),
      o('e_drinks', 7, 3, '#8fc9a0', '飲'),
      deco('deco_sofa', 9, 6, '#7b5ea7', 3, 1),
    ],
  }),
  r503: room({
    w: 14, h: 10, floor: '#aab4c0', wall: '#454e63',
    doors: [{ x: 2, y: 9, to: 'hall' }],
    objects: [
      o('bookshelf', 10, 1, '#8b5a2b', '書', 2, 1),
      o('c_sleeptalk', 4, 3, '#e8b49a', '哲'),
      o('e_labsignup', 2, 0, '#e8e0a0', '板'),
      o('e_seniorcode', 8, 6, '#4f6bd1', '腦'),
      o('e_format', 4, 6, '#9fb4d9', '檔'),
      deco('deco_desk', 7, 3, '#7c6a58', 2, 1),
    ],
  }),
  office: room({
    w: 14, h: 10, floor: '#d9d3c0', wall: '#5e6b58',
    doors: [{ x: 11, y: 9, to: 'hall' }],
    objects: [
      o('keypad', 6, 0, '#3a3f4f', '鍵'),
      o('c_trash_notice', 2, 5, '#9a9a9a', '桶'),
      o('e_printer', 10, 2, '#cfd3da', '印'),
      o('e_studygroup', 4, 2, '#e6d3a0', '簽'),
      deco('deco_desk', 7, 4, '#8a7a66', 3, 1),
    ],
  }),
  lab: room({
    w: 18, h: 10, floor: '#9fb0c4', wall: '#2f3a52',
    doors: [{ x: 2, y: 0, to: 'hall' }],
    objects: [
      o('lab_pc', 9, 2, '#2f2f3a', '電', 2, 1),
      o('e_restore', 4, 4, '#6f86b0', '電'),
      o('e_sync', 6, 4, '#6fb0a0', '雲'),
      o('e_usbseat', 12, 6, '#b0a06f', '碟'),
      deco('deco_row1', 3, 7, '#566078', 4, 1),
      deco('deco_row2', 10, 4, '#566078', 4, 1),
    ],
  }),
  floor1: room({
    w: 18, h: 10, floor: '#c4b9a8', wall: '#6a4a4a',
    doors: [{ x: 14, y: 0, to: 'hall' }],
    objects: [
      o('broadcast', 3, 1, '#c44f7a', '播', 2, 1),
      o('c_broadcast_manual', 6, 0, '#f4f4f4', '說'),
      o('c_guard', 15, 5, '#e0a870', '警'),
      o('e_guardpc', 12, 5, '#5a7fb0', '腦'),
      o('e_bbq', 2, 5, '#d98a4a', '烤'),
      deco('deco_counter', 11, 3, '#8a6a50', 5, 1),
    ],
  }),
};

__exports.TILE = TILE;
__exports.MAPS = MAPS;

});

__def("game/ui/assets-logic.js", function (__require, __exports) {
// 素材對照表的純邏輯（不碰 DOM），方便測試。

const FALLBACK_COLOR = '#888';

/** src 只接受非空字串，其餘（null、空字串、空白、非字串）都當作沒有。 */
function normalizeSrc(src) {
  return typeof src === 'string' && src.trim() ? src.trim() : null;
}

/** 從對照表取素材；表裡沒有的 key 回傳灰色後備。回傳的 src 已正規化。 */
function resolveAsset(table, key) {
  const a = table?.[key];
  if (!a) return { color: FALLBACK_COLOR, label: String(key), src: null, known: false };
  return { color: a.color || FALLBACK_COLOR, label: a.label ?? String(key), src: normalizeSrc(a.src), known: true };
}

/**
 * 圖片快取。load(src, onOk, onFail) 由呼叫端提供（瀏覽器用 Image，測試用假的）。
 * get(src) 回傳「已載入好的圖」或 null（沒填、載入中、載入失敗都是 null，呼叫端就畫色塊）。
 * 失敗的 src 不會重試。
 */
function createImageCache(load) {
  const state = new Map(); // src -> { status: 'loading' | 'ok' | 'fail', img, waiting: [] }
  const start = (s) => {
    let e = state.get(s);
    if (e) return e;
    e = { status: 'loading', img: null, waiting: [] };
    state.set(s, e);
    const finish = (status, img) => {
      e.status = status;
      e.img = img;
      for (const fn of e.waiting.splice(0)) fn(img);
    };
    load(s, (img) => finish('ok', img), () => finish('fail', null));
    return e;
  };
  return {
    get(src) {
      const s = normalizeSrc(src);
      return s && start(s).status === 'ok' ? state.get(s).img : null;
    },
    /** 載好（或失敗）時呼叫 done(圖 或 null)；同一個 src 只會請求一次。 */
    whenReady(src, done) {
      const s = normalizeSrc(src);
      if (!s) return;
      const e = start(s);
      if (e.status === 'loading') e.waiting.push(done);
      else done(e.img);
    },
    status(src) { return state.get(normalizeSrc(src))?.status ?? 'none'; },
  };
}

__exports.normalizeSrc = normalizeSrc;
__exports.resolveAsset = resolveAsset;
__exports.createImageCache = createImageCache;

});

__def("game/ui/assets.js", function (__require, __exports) {
// 素材對照表（WP7）。格式 { key: { color, label, src } }。
// src 是 null（或空字串）時畫 color 色塊；填 'assets/xxx.png' 就顯示那張圖，載入失敗自動退回色塊。
// 尺寸與命名建議見 assets/README.md。key 不要改（程式和 content/*.json 都用它對應）。
const { resolveAsset, createImageCache } = __require("game/ui/assets-logic.js");

const ASSETS = {
  // ----- 角色（建議 16×16，站姿朝下）-----
  player: { color: '#e56b6f', label: '主角', src: null },
  // ----- 地圖物件（1 格 = 16×16，寬 2 格 = 32×16，依此類推）-----
  laptop: { color: '#5b7fd1', label: '筆', src: null },
  c_laptop_note: { color: '#f2e07a', label: '條', src: null },
  lectern: { color: '#8a5a3c', label: '講', src: null },
  c_exam_calc: { color: '#f0ece0', label: '考', src: null },
  c_exam_stat: { color: '#f0ece0', label: '考', src: null },
  c_syllabus: { color: '#d9d2b8', label: '綱', src: null },
  c_whiteboard: { color: '#f4f4f4', label: '白', src: null },
  e_whiteboard_role: { color: '#e8e8e8', label: '工', src: null },
  e_timetable: { color: '#a7c4a0', label: '課', src: null },
  door: { color: '#4a4a58', label: '門', src: null },
  e_desk: { color: '#9c7b57', label: '桌', src: null },
  e_tablet: { color: '#5a5f7a', label: '板', src: null },
  e_exam: { color: '#c8b6a6', label: '古', src: null },
  e_citation: { color: '#b5cfe0', label: '引', src: null },
  phone: { color: '#3ec28f', label: '機', src: null },
  hint: { color: '#f0b429', label: '助', src: null },
  switch_panel: { color: '#d4c04a', label: '燈', src: null },
  c_floorplan: { color: '#7fb8d9', label: '圖', src: null },
  c_plaque: { color: '#c9a24a', label: '匾', src: null },
  e_yearbook: { color: '#e08bb0', label: '冊', src: null },
  e_survey: { color: '#8fd0c0', label: '問', src: null },
  vending: { color: '#d94f4f', label: '販', src: null },
  c_pantry_board: { color: '#f4f4f4', label: '板', src: null },
  e_delivery: { color: '#f09a3e', label: '送', src: null },
  e_drinks: { color: '#8fc9a0', label: '飲', src: null },
  bookshelf: { color: '#8b5a2b', label: '書', src: null },
  c_sleeptalk: { color: '#e8b49a', label: '哲', src: null },
  e_labsignup: { color: '#e8e0a0', label: '板', src: null },
  e_seniorcode: { color: '#4f6bd1', label: '腦', src: null },
  e_format: { color: '#9fb4d9', label: '檔', src: null },
  keypad: { color: '#3a3f4f', label: '鍵', src: null },
  c_trash_notice: { color: '#9a9a9a', label: '桶', src: null },
  e_printer: { color: '#cfd3da', label: '印', src: null },
  e_studygroup: { color: '#e6d3a0', label: '簽', src: null },
  lab_pc: { color: '#2f2f3a', label: '電', src: null },
  e_restore: { color: '#6f86b0', label: '電', src: null },
  e_sync: { color: '#6fb0a0', label: '雲', src: null },
  e_usbseat: { color: '#b0a06f', label: '碟', src: null },
  broadcast: { color: '#c44f7a', label: '播', src: null },
  c_broadcast_manual: { color: '#f4f4f4', label: '說', src: null },
  c_guard: { color: '#e0a870', label: '警', src: null },
  e_guardpc: { color: '#5a7fb0', label: '腦', src: null },
  e_bbq: { color: '#d98a4a', label: '烤', src: null },
  // ----- 純裝飾（不能互動，會擋路）-----
  deco_chair: { color: '#7a6a52', label: 'deco_chair', src: null },
  deco_bench: { color: '#8a7a66', label: 'deco_bench', src: null },
  deco_bench2: { color: '#8a7a66', label: 'deco_bench2', src: null },
  deco_sofa: { color: '#7b5ea7', label: 'deco_sofa', src: null },
  deco_desk: { color: '#7c6a58', label: 'deco_desk', src: null },
  deco_row1: { color: '#566078', label: 'deco_row1', src: null },
  deco_row2: { color: '#566078', label: 'deco_row2', src: null },
  deco_counter: { color: '#8a6a50', label: 'deco_counter', src: null },
  // ----- 死因卡圖與圖鑑縮圖（建議 16×16，兩處共用同一張）-----
  death_lockout: { color: '#888', label: '密碼打錯三次', src: null },
  death_update_later: { color: '#888', label: '稍後提醒我', src: null },
  death_update_now: { color: '#888', label: '立即重新啟動', src: null },
  death_autorecover: { color: '#888', label: '自動修復', src: null },
  death_lastyear_notice: { color: '#888', label: '延期公告', src: null },
  death_mom_call: { color: '#888', label: '媽媽來電', src: null },
  death_nap: { color: '#888', label: '瞇 15 分鐘', src: null },
  death_tidy: { color: '#888', label: '幫你整理', src: null },
  death_final: { color: '#888', label: '最終版', src: null },
  death_really_final: { color: '#888', label: '真的最終', src: null },
  death_plusone: { color: '#888', label: '+1', src: null },
  death_guest: { color: '#888', label: '以訪客身分登入', src: null },
  death_forgot: { color: '#888', label: '忘記密碼', src: null },
  death_admin_mail: { color: '#888', label: '保持聯繫', src: null },
  death_senior_account: { color: '#888', label: '記住帳號', src: null },
  death_lastyear_course: { color: '#888', label: '去年的課', src: null },
  death_conclusion: { color: '#888', label: '結論寫好了', src: null },
  death_wakeall: { color: '#888', label: '全館最大聲', src: null },
  death_dinner: { color: '#888', label: '吃個飯而已', src: null },
  death_desk: { color: '#888', label: '先整理桌面', src: null },
  death_tablet: { color: '#888', label: '看一集就好', src: null },
  death_exam: { color: '#888', label: '大概不會考', src: null },
  death_timetable: { color: '#888', label: '早八不會點名', src: null },
  death_citation: { color: '#888', label: '之後再補引用', src: null },
  death_integrate: { color: '#888', label: '我來整合就好', src: null },
  death_yearbook: { color: '#888', label: '幫大家拍照', src: null },
  death_survey: { color: '#888', label: '填個問卷而已', src: null },
  death_delivery: { color: '#888', label: '湊免運', src: null },
  death_drinks: { color: '#888', label: '第二杯半價', src: null },
  death_labsignup: { color: '#888', label: '去實驗室看看', src: null },
  death_seniorcode: { color: '#888', label: '幫看一下就好', src: null },
  death_format: { color: '#888', label: '幫組員改格式', src: null },
  death_printer: { color: '#888', label: '幫忙拉卡紙', src: null },
  death_studygroup: { color: '#888', label: '簽個名而已', src: null },
  death_restore: { color: '#888', label: '存在桌面', src: null },
  death_sync: { color: '#888', label: '兩台一起開', src: null },
  death_usbseat: { color: '#888', label: '插著隨身碟佔位', src: null },
  death_guardpc: { color: '#888', label: '誰會修電腦', src: null },
  death_bbq: { color: '#888', label: '有空的寫名字', src: null },
  // ----- 結局圖（建議 16×16）-----
  end_door: { color: '#888', label: '門其實沒鎖', src: null }, // 死法 d_door 的圖（沿用原本的 key）
  end_dawn: { color: '#888', label: '天亮了', src: null },
  end_no_submit: { color: '#888', label: '人出來了，報告沒交', src: null },
  end_normal: { color: '#888', label: '交了，也出來了', src: null },
  end_true: { color: '#888', label: '1 則未讀', src: null },
};

/** 取得素材；表裡沒有的 key 回傳灰色後備。 */
function getAsset(key) {
  return resolveAsset(ASSETS, key);
}

// ---------- 圖片載入（瀏覽器專用，載入失敗就當沒有圖）----------
const cache = createImageCache((src, ok, fail) => {
  const img = new Image();
  img.onload = () => ok(img);
  img.onerror = fail;
  img.src = src;
});

/** 這個 key 目前能用的圖（已載入好才有），沒有就回傳 null，呼叫端改畫色塊。 */
function getImage(key) {
  return cache.get(getAsset(key).src);
}

/** 等某個 key 的圖載好（或失敗）後呼叫 done(img 或 null)。給 DOM 畫面用，同一張圖只請求一次。 */
function whenImage(key, done) {
  cache.whenReady(getAsset(key).src, done);
}

__exports.getAsset = getAsset;
__exports.getImage = getImage;
__exports.whenImage = whenImage;
__exports.ASSETS = ASSETS;

});

__def("game/ui/flavor-logic.js", function (__require, __exports) {
// 氣氛與台詞的純邏輯（不碰 DOM），方便用 node:test 測。
// 時鐘單位都是「從 00:00 起算的分鐘」，和核心一致。

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

// 窗外天色：深夜一路到天亮
const SKY_STOPS = [
  [0, '#0a0f2c'],
  [300, '#121a4a'],
  [340, '#3b3f8a'],
  [380, '#b8678f'],
  [420, '#f4b26b'],
];

/** 某個時間的窗外顏色。 */
function skyColor(clock) {
  if (clock <= SKY_STOPS[0][0]) return SKY_STOPS[0][1];
  for (let i = 1; i < SKY_STOPS.length; i += 1) {
    const [t1, c1] = SKY_STOPS[i];
    const [t0, c0] = SKY_STOPS[i - 1];
    if (clock <= t1) {
      const k = (clock - t0) / (t1 - t0);
      const a = hex(c0), b = hex(c1);
      return toHex(a.map((v, j) => v + (b[j] - v) * k));
    }
  }
  return SKY_STOPS[SKY_STOPS.length - 1][1];
}

/** 天亮的程度 0～1：05:00 前是 0，07:00 是 1。 */
function dawnLevel(clock) {
  return Math.max(0, Math.min(1, (clock - 300) / 120));
}

/** 房間的暗度（0 = 全亮，1 = 全黑）：基本暗度，越接近天亮越亮一點。 */
function darkness(base, clock) {
  return Math.max(0, base * (1 - 0.5 * dawnLevel(clock)));
}

/**
 * 該跳出來的手機通知／旁白：時間到了、還沒顯示過的。
 * @param {{at:number}[]} list  texts.flavor.chatter
 * @param {number} clock
 * @param {Set<number>} shown  已經顯示過的索引
 */
function dueChatter(list, clock, shown) {
  const out = [];
  list.forEach((c, i) => { if (c.at <= clock && !shown.has(i)) out.push(i); });
  return out;
}

/** 依序輪流拿台詞（拿到最後一句後從頭開始）。counts 會被更新。 */
function nextLine(lines, key, counts) {
  if (!lines?.length) return null;
  const n = counts[key] ?? 0;
  counts[key] = n + 1;
  return lines[n % lines.length];
}

/** 打字機效果每個字的毫秒數和總長度（給死因卡的點擊保護用）。 */
const TYPE_MS = 32;
function typeDuration(text) {
  return [...String(text ?? '')].length * TYPE_MS;
}

__exports.skyColor = skyColor;
__exports.dawnLevel = dawnLevel;
__exports.darkness = darkness;
__exports.dueChatter = dueChatter;
__exports.nextLine = nextLine;
__exports.typeDuration = typeDuration;
__exports.SKY_STOPS = SKY_STOPS;
__exports.TYPE_MS = TYPE_MS;

});

__def("game/ui/world/sprites.js", function (__require, __exports) {
// 程式畫的像素圖：地圖物件、地板、牆、門、主角。沒有外部素材時用這些；
// assets.js 填了 src 就改用圖片（由 index.js 判斷），燈光一樣疊在最上面。
// 座標單位是畫布像素，1 格 = 16。每個物件畫在自己的格子範圍內（寬 w、高 h）。

const PAL = {
  ol: '#1b1a22', shadow: 'rgba(0,0,0,.28)',
  wood: '#9c6b43', woodD: '#6b4428', woodL: '#c08a5a',
  metal: '#8b93a7', metalD: '#5d6478', metalL: '#c3c9d6',
  paper: '#f2ede0', paperD: '#cfc6ae', ink: '#4a4f63',
  screen: '#18233f', glow: '#7fb2ff', glowL: '#c4dcff',
  red: '#d94f4f', redD: '#8e2f33', green: '#3ec28f', greenD: '#21765a',
  yellow: '#f0d040', orange: '#f09a3e', pink: '#e08bb0', purple: '#7b5ea7', purpleD: '#56407a',
  white: '#f4f4f4', black: '#15161c', skin: '#f2c9a0', hair: '#3a2a2a', blue: '#3d5fa8', blueD: '#2a4277',
  cork: '#c79a5e', corkD: '#a37a45', gold: '#d9b44a', goldD: '#9c7a26',
};
const P = PAL;

// 決定性的小雜訊（紋理用），同一格永遠一樣
const hash = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

function pen(g, ox, oy) {
  return (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(ox + x, oy + y, w, h); };
}

// ---------- 共用零件 ----------
// 桌子：桌面在 top～top+th，下面四隻腳（從正面看兩隻）
function desk(r, w, top = 7, th = 5, color = P.wood) {
  r(1, 15, w - 2, 1, P.shadow);
  r(1, top + th, 2, 15 - top - th, P.woodD);
  r(w - 3, top + th, 2, 15 - top - th, P.woodD);
  r(0, top, w, th, P.ol);
  r(1, top, w - 2, th - 1, color);
  r(1, top, w - 2, 1, P.woodL);
}
// 螢幕（桌上型）：左上角 (x, y)，寬 w
function monitor(r, x, y, w = 10, h = 7, lines = true, t = 0) {
  r(x, y, w, h, P.ol);
  r(x + 1, y + 1, w - 2, h - 2, P.screen);
  if (lines) {
    for (let i = 0; i < h - 3; i += 2) r(x + 2, y + 2 + i, Math.max(2, (w - 4) - ((i * 3) % 4)), 1, i % 4 ? P.green : P.glow);
  }
  r(x + w / 2 - 1, y + h, 2, 1, P.metalD);
  r(x + w / 2 - 2, y + h + 1, 4, 1, P.metalD);
}
// 牆上的紙或板子
function framed(r, x, y, w, h, bg, frame = P.ol) {
  r(x, y, w, h, frame);
  r(x + 1, y + 1, w - 2, h - 2, bg);
}
function lines(r, x, y, w, n, c = P.ink, gap = 2) {
  for (let i = 0; i < n; i += 1) r(x, y + i * gap, Math.max(2, w - ((i * 5) % 4)), 1, c);
}
// 立牌（海報架）：海報在上面，下面兩隻腳
function easel(r, poster, inner) {
  r(3, 15, 10, 1, P.shadow);
  r(4, 11, 1, 5, P.woodD); r(11, 11, 1, 5, P.woodD);
  framed(r, 2, 1, 12, 11, poster);
  inner?.();
}
// 椅子（從上方斜看）
function chair(r, x = 4, y = 6, c = P.metalD) {
  r(x, y, 8, 3, c); r(x, y, 8, 1, P.metal);
  r(x + 1, y + 3, 6, 4, c); r(x + 1, y + 3, 6, 1, P.metal);
  r(x + 1, y + 7, 1, 2, P.ol); r(x + 6, y + 7, 1, 2, P.ol);
}
// 睡著的人：趴在桌上（從正面看到頭頂和手臂）
function sleeper(r, hat = null) {
  desk(r, 16, 9, 4);
  r(3, 7, 10, 3, P.blue); // 手臂
  r(5, 3, 6, 5, P.ol);
  r(5, 3, 6, 4, hat ? P.skin : P.hair); // 頭
  if (hat) { r(4, 2, 8, 2, hat); r(4, 4, 8, 1, P.ol); }
  else r(5, 6, 6, 1, P.skin);
}

// ---------- 各物件 ----------
const SPRITES = {
  // ===== 401 =====
  laptop(r, w, h, t) {
    desk(r, w);
    r(3, 1, 10, 7, P.ol); r(4, 2, 8, 5, P.screen); // 螢幕
    const blink = Math.floor(t / 600) % 2;
    r(5, 3, 5, 1, P.glow); r(5, 5, 3, 1, P.glowL); if (blink) r(9, 5, 1, 1, P.white);
    r(2, 8, 12, 2, P.metalD); r(3, 8, 10, 1, P.metalL); // 鍵盤
  },
  c_laptop_note(r, w) {
    desk(r, w);
    r(4, 5, 7, 6, P.ol); r(5, 5, 5, 5, P.yellow); r(6, 7, 3, 1, P.ink); r(6, 9, 2, 1, P.ink); // 便利貼
    r(11, 8, 4, 1, P.blue); // 筆
  },
  lectern(r, w) {
    r(2, 15, w - 4, 1, P.shadow);
    r(3, 3, w - 6, 13, P.ol);
    r(4, 4, w - 8, 11, P.wood);
    r(4, 4, w - 8, 1, P.woodL);
    r(1, 2, w - 2, 3, P.ol); r(2, 2, w - 4, 2, P.woodL); // 桌面邊
    r(8, 8, w - 16, 4, P.woodD); r(w / 2 - 1, 9, 2, 2, P.gold); // 抽屜和鎖
  },
  c_exam_calc(r) { crumpled(r, '58'); },
  c_exam_stat(r) { crumpled(r, '61'); },
  c_syllabus(r) {
    framed(r, 3, 1, 10, 13, P.paper);
    lines(r, 5, 3, 6, 4);
    r(9, 10, 3, 3, P.red); // 印章
  },
  c_whiteboard(r) {
    framed(r, 1, 2, 14, 10, P.white, P.metalD);
    r(3, 4, 6, 1, P.blue); r(3, 6, 9, 1, P.red); r(3, 8, 4, 1, P.blue);
    r(2, 12, 12, 1, P.metal); // 板擦槽
  },
  e_whiteboard_role(r) {
    framed(r, 1, 2, 14, 10, P.white, P.metalD);
    for (let x = 5; x < 14; x += 4) r(x, 3, 1, 8, P.paperD);
    r(2, 5, 12, 1, P.paperD);
    r(2, 3, 2, 1, P.blue); r(6, 3, 2, 1, P.blue); r(10, 3, 2, 1, P.red);
    r(2, 12, 12, 1, P.metal);
  },
  e_timetable(r) {
    framed(r, 2, 1, 12, 12, P.paper);
    const cols = ['#a7c4a0', '#e9b6b6', '#b6c8e9', '#f0d58a'];
    for (let y = 0; y < 4; y += 1) for (let x = 0; x < 4; x += 1) if (hash(x, y, 3) > 0.35) r(3 + x * 2.5, 2 + y * 2.6, 2, 2, cols[(x + y) % 4]);
  },
  door(r) { doorShape(r, 0, P.woodD, P.wood); },
  e_desk(r, w) {
    desk(r, w);
    r(1, 5, 6, 3, P.paper); r(2, 4, 5, 3, P.paperD); // 亂丟的紙
    r(9, 3, 4, 5, P.ol); r(10, 4, 2, 3, P.white); // 杯子
    r(6, 8, 6, 1, P.black); r(12, 9, 3, 1, P.black); // 電線
  },
  e_tablet(r, w, h, t) {
    desk(r, w);
    r(3, 3, 10, 7, P.ol); r(4, 4, 8, 5, P.screen);
    r(7, 5, 1, 3, P.white); r(8, 6, 1, 1, P.white); // 播放鍵
    if (Math.floor(t / 900) % 2) r(4, 8, 8 * ((t / 9000) % 1), 1, P.red);
  },
  e_exam(r, w) {
    desk(r, w);
    for (let i = 0; i < 4; i += 1) r(3 + i, 7 - i, 9, 2, i % 2 ? P.paperD : P.paper);
    r(4, 4, 7, 1, P.ink);
  },
  e_citation(r, w) {
    desk(r, w);
    r(2, 3, 12, 6, P.ol); r(3, 3, 5, 5, P.paper); r(8, 3, 5, 5, P.paper); r(8, 3, 1, 5, P.paperD); // 打開的書
    lines(r, 4, 4, 3, 2); lines(r, 9, 4, 3, 2);
    r(10, 6, 3, 1, P.yellow); // 螢光筆
  },
  phone(r, w, h, t) {
    r(3, 14, 10, 2, P.shadow);
    r(4, 8, 8, 6, P.woodD); r(4, 8, 8, 1, P.woodL); // 小板凳
    r(5, 2, 6, 7, P.ol); r(6, 3, 4, 5, Math.floor(t / 700) % 2 ? P.glow : P.screen);
    r(10, 1, 2, 2, P.red); // 未讀紅點
  },
  hint(r, w, h, t) { // AI 助教：小機器人終端機
    r(3, 14, 10, 2, P.shadow);
    r(7, 0, 2, 2, P.ol); r(7, 0, 2, 1, Math.floor(t / 500) % 2 ? P.red : P.yellow); // 天線
    r(3, 2, 10, 8, P.ol); r(4, 3, 8, 6, P.metalL);
    r(5, 4, 6, 4, P.screen); r(6, 5, 1, 2, P.glow); r(9, 5, 1, 2, P.glow); // 臉
    r(5, 10, 6, 5, P.metalD); r(6, 11, 4, 1, P.yellow);
  },
  deco_chair(r) { chair(r, 4, 4, P.woodD); },

  // ===== 走廊 =====
  switch_panel(r) {
    framed(r, 2, 3, 12, 8, P.paper, P.metalD);
    for (let i = 0; i < 6; i += 1) { r(3 + i * 2, 5, 1, 4, P.ol); r(3 + i * 2, 5 + (i % 2) * 2, 1, 2, P.white); }
  },
  c_floorplan(r) {
    framed(r, 1, 2, 14, 11, '#dff1e4', P.greenD);
    r(3, 4, 10, 1, P.greenD); r(3, 4, 1, 6, P.greenD); r(12, 4, 1, 6, P.greenD);
    r(5, 7, 4, 1, P.red); r(8, 6, 1, 3, P.red); // 箭頭
  },
  c_plaque(r) {
    r(2, 4, 12, 8, P.goldD); r(3, 5, 10, 6, P.gold); lines(r, 4, 6, 8, 3, P.goldD);
  },
  e_yearbook(r) {
    easel(r, P.pink, () => { r(5, 4, 6, 4, P.ol); r(6, 5, 4, 2, P.metal); r(7, 5, 2, 2, P.screen); r(9, 3, 1, 1, P.ol); }); // 相機
  },
  e_survey(r) {
    easel(r, P.white, () => {
      for (let y = 0; y < 7; y += 1) for (let x = 0; x < 7; x += 1) if (hash(x, y, 9) > 0.5 || (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4)) r(4 + x, 3 + y, 1, 1, P.ol);
    });
  },
  deco_bench(r, w) { bench(r, w); },
  deco_bench2(r, w) { bench(r, w); },

  // ===== 茶水間 =====
  vending(r, w) {
    r(1, 15, w - 2, 1, P.shadow);
    r(2, 0, w - 4, 16, P.ol);
    r(3, 1, w - 6, 14, P.red);
    r(3, 1, w - 6, 1, '#f08a8a');
    r(4, 2, 17, 8, P.ol); // 商品窗
    const cans = ['#6b3f2a', '#6b3f2a', '#c43a2e', '#e8e8e8', '#3a8fd9', '#f0b429'];
    for (let i = 0; i < 6; i += 1) { r(5 + (i % 3) * 5, 3 + Math.floor(i / 3) * 4, 3, 3, cans[i]); r(5 + (i % 3) * 5, 3 + Math.floor(i / 3) * 4, 3, 1, P.white); }
    r(23, 3, 4, 2, P.black); r(24, 6, 2, 3, P.metalL); // 投幣口、按鈕
    r(6, 11, 14, 3, P.black); // 出貨口
  },
  c_pantry_board(r) {
    framed(r, 1, 2, 14, 10, P.white, P.metalD);
    const c = ['#6b3f2a', '#6b3f2a', '#c43a2e', '#3a8fd9'];
    for (let i = 0; i < 4; i += 1) { r(3 + i * 3, 5, 2, 4, c[i]); r(3 + i * 3, 4, 2, 1, P.metal); }
  },
  e_delivery(r, w) {
    desk(r, w);
    r(3, 0, 10, 8, P.ol); r(4, 1, 8, 6, P.orange); r(4, 1, 8, 1, '#f7c28a'); r(6, 3, 4, 2, P.white); // 外送袋
    r(12, 5, 3, 4, P.ol); r(12, 6, 3, 2, P.orange); // 手機
  },
  e_drinks(r) {
    easel(r, P.paper, () => {
      r(6, 3, 5, 7, P.ol); r(7, 4, 3, 5, '#e7c9a0'); r(7, 7, 3, 2, P.ol); r(8, 1, 1, 3, P.pink); // 珍奶
      r(3, 3, 2, 1, P.red); r(3, 5, 2, 1, P.red);
    });
  },
  deco_sofa(r, w) {
    r(1, 15, w - 2, 1, P.shadow);
    r(0, 3, w, 12, P.ol);
    r(1, 4, w - 2, 5, P.purpleD); // 椅背
    r(1, 9, w - 2, 5, P.purple);
    for (let x = 16; x < w - 1; x += 16) r(x, 9, 1, 5, P.purpleD);
    r(0, 7, 3, 8, P.purpleD); r(w - 3, 7, 3, 8, P.purpleD); // 扶手
  },

  // ===== 503 =====
  bookshelf(r, w) {
    r(1, 15, w - 2, 1, P.shadow);
    r(1, 0, w - 2, 16, P.ol);
    r(2, 1, w - 4, 14, P.woodD);
    const cols = ['#c44f4f', '#3d5fa8', '#3ec28f', '#f0b429', '#7b5ea7', '#e8e8e8', '#f09a3e'];
    for (const shelfY of [1, 8]) {
      let x = 3;
      let i = shelfY;
      while (x < w - 4) {
        const bw = 2 + Math.floor(hash(x, shelfY, 5) * 2);
        const bh = 5 + Math.floor(hash(x, shelfY, 6) * 2);
        r(x, shelfY + 6 - bh, bw, bh, cols[(i += 3) % cols.length]);
        r(x, shelfY + 7 - bh, bw, 1, 'rgba(255,255,255,.35)');
        x += bw + 1;
      }
      r(2, shelfY + 6, w - 4, 1, P.wood);
    }
  },
  c_sleeptalk(r) { sleeper(r); },
  e_labsignup(r) {
    framed(r, 1, 2, 14, 11, P.cork, P.corkD);
    r(3, 4, 4, 3, P.white); r(8, 3, 5, 4, P.yellow); r(4, 8, 6, 3, P.white);
    r(4, 4, 1, 1, P.red); r(10, 3, 1, 1, P.red); r(6, 8, 1, 1, P.red);
  },
  e_seniorcode(r, w, h, t) {
    desk(r, w, 9, 4);
    monitor(r, 3, 1, 10, 7, true, t);
    r(4, 10, 8, 1, P.metalL);
  },
  e_format(r, w) {
    desk(r, w);
    r(3, 1, 10, 7, P.ol); r(4, 2, 8, 5, P.white); lines(r, 5, 3, 6, 2, P.ink); r(5, 5, 3, 1, P.red);
    r(2, 8, 12, 2, P.metalD);
  },
  deco_desk(r, w) {
    desk(r, w);
    if (w >= 32) { r(4, 4, 8, 3, P.paper); r(w - 12, 3, 6, 4, P.ol); r(w - 11, 4, 4, 2, P.screen); }
  },

  // ===== 系辦 =====
  keypad(r, w, h, t) {
    r(4, 2, 8, 12, P.ol); r(5, 3, 6, 10, P.metalD);
    r(6, 4, 4, 2, Math.floor(t / 700) % 2 ? P.green : P.greenD);
    for (let y = 0; y < 3; y += 1) for (let x = 0; x < 3; x += 1) r(5.5 + x * 2, 7 + y * 2, 1, 1, P.metalL);
  },
  c_trash_notice(r) {
    r(3, 15, 10, 1, P.shadow);
    r(4, 5, 8, 11, P.ol); r(5, 6, 6, 9, P.metal); r(4, 4, 8, 2, P.metalD);
    r(6, 7, 1, 7, P.metalL); r(9, 7, 1, 7, P.metalL);
    r(6, 1, 4, 4, P.ol); r(7, 2, 3, 3, P.paper); // 揉掉的公告露出來
  },
  e_printer(r, w, h, t) {
    r(1, 15, 14, 1, P.shadow);
    r(1, 5, 14, 10, P.ol); r(2, 6, 12, 8, P.metalL); r(2, 6, 12, 1, P.white);
    r(4, 9, 8, 2, P.black); // 出紙口
    r(5, 2, 6, 7, P.paper); r(6, 4, 4, 1, P.ink); // 卡住的紙
    r(12, 12, 1, 1, Math.floor(t / 400) % 2 ? P.red : P.redD);
  },
  e_studygroup(r, w) {
    desk(r, w);
    r(4, 2, 8, 9, P.ol); r(5, 3, 6, 7, P.paper); r(6, 2, 4, 2, P.metalD); lines(r, 6, 5, 4, 3);
  },

  // ===== 電腦教室 =====
  lab_pc(r, w, h, t) {
    desk(r, w, 9, 4);
    monitor(r, 2, 1, 12, 8, true, t);
    monitor(r, 18, 1, 12, 8, false, t);
    r(20, 3, 8, 1, P.red); r(20, 5, 6, 1, P.glow); // Moodle 頁
    r(6, 10, 20, 1, P.metalL);
  },
  e_restore(r, w, h, t) { desk(r, w, 9, 4); monitor(r, 3, 1, 10, 7, true, t); },
  e_sync(r, w, h, t) {
    desk(r, w, 9, 4); monitor(r, 3, 1, 10, 7, false, t);
    const a = Math.floor(t / 250) % 4; // 同步圈圈
    r(6, 3, 4, 3, P.white); r(6 + (a % 2) * 3, 3 + (a > 1 ? 2 : 0), 1, 1, P.glow);
  },
  e_usbseat(r, w) {
    desk(r, w, 6, 4);
    r(9, 4, 4, 2, P.blue); r(13, 4, 2, 2, P.metalL); // 隨身碟
    chair(r, 4, 10, P.metalD);
  },
  deco_row1(r, w, h, t) { pcRow(r, w, t); },
  deco_row2(r, w, h, t) { pcRow(r, w, t); },

  // ===== 一樓 =====
  broadcast(r, w, h, t) {
    r(1, 15, w - 2, 1, P.shadow);
    r(1, 6, w - 2, 9, P.ol); r(2, 7, w - 4, 7, P.metalD); r(2, 7, w - 4, 1, P.metal);
    for (let i = 0; i < 6; i += 1) { r(4 + i * 3, 8, 1, 5, P.black); r(3.5 + i * 3, 9 + ((i * 2 + Math.floor(t / 1200)) % 3), 2, 1, P.metalL); }
    r(23, 9, 3, 3, P.red); r(27, 9, 2, 2, P.green); // 按鈕
    r(9, 0, 1, 6, P.ol); r(8, 0, 3, 2, P.black); // 麥克風
  },
  c_broadcast_manual(r) { framed(r, 3, 2, 10, 12, P.paper); r(4, 3, 8, 2, P.red); lines(r, 5, 7, 6, 3); },
  c_guard(r) { sleeper(r, P.blueD); },
  e_guardpc(r, w) {
    desk(r, w, 10, 3);
    r(2, 1, 12, 10, P.ol); r(3, 2, 10, 8, '#d8d2bf'); r(4, 3, 8, 5, P.screen); r(5, 4, 4, 1, P.green); // 老電腦
  },
  e_bbq(r) {
    easel(r, '#f6d7b0', () => {
      r(5, 7, 6, 2, P.ol); r(4, 6, 8, 1, P.metalD); // 烤肉架
      r(5, 4, 2, 2, P.orange); r(8, 3, 2, 2, P.red); r(5, 9, 1, 2, P.ol); r(10, 9, 1, 2, P.ol);
    });
  },
  deco_counter(r, w) {
    r(1, 15, w - 2, 1, P.shadow);
    r(0, 3, w, 12, P.ol); r(1, 4, w - 2, 10, P.wood); r(0, 3, w, 2, P.woodL);
    for (let x = 12; x < w; x += 16) r(x, 6, 1, 8, P.woodD);
  },
};

function crumpled(r, score) {
  r(3, 12, 10, 2, P.shadow);
  r(2, 5, 12, 8, P.ol);
  r(3, 6, 10, 6, P.paper);
  r(3, 6, 4, 2, P.paperD); r(9, 10, 4, 2, P.paperD); r(7, 8, 2, 1, P.paperD);
  r(4, 9, 4, 1, P.ink);
  r(9, 7, 3, 2, P.red); // 紅筆分數
  r(score === '58' ? 12 : 11, 6, 1, 1, P.red);
}
function bench(r, w) {
  r(1, 14, w - 2, 1, P.shadow);
  r(0, 6, w, 6, P.ol);
  for (let y = 0; y < 2; y += 1) { r(1, 7 + y * 2, w - 2, 1, P.woodL); r(1, 8 + y * 2, w - 2, 1, P.wood); }
  r(3, 12, 2, 3, P.metalD); r(w - 5, 12, 2, 3, P.metalD);
}
function pcRow(r, w, t) {
  desk(r, w, 9, 4);
  for (let x = 2; x + 10 <= w; x += 16) monitor(r, x, 1, 11, 7, hash(x, 1, 2) > 0.5, t);
}
// 門（上牆或下牆上的門格、401 左上角的門）
function doorShape(r, y0, dark, light) {
  r(1, y0, 14, 16, P.ol);
  r(2, y0 + 1, 12, 15, light);
  r(3, y0 + 2, 10, 5, dark); r(3, y0 + 9, 10, 5, dark);
  r(11, y0 + 7, 2, 2, P.gold);
}

/** 畫物件；有這個 id 的程式圖就畫並回傳 true，沒有回傳 false（呼叫端改畫色塊）。 */
function drawSprite(g, ob, rect, t) {
  const fn = SPRITES[ob.id];
  if (!fn) return false;
  const w = rect.x1 - rect.x0, h = rect.y1 - rect.y0;
  fn(pen(g, rect.x0, rect.y0), w, h, t);
  return true;
}
const SPRITE_IDS = Object.keys(SPRITES);

// ---------- 地板與牆 ----------
// 每個房間一種地板：木地板、磁磚、黑白格、地毯、塑膠地磚、高架地板、磨石子
const FLOORS = {
  r401: 'planks', hall: 'tiles', pantry: 'checker', r503: 'carpet', office: 'lino', lab: 'panels', floor1: 'terrazzo',
};
const WALLS = { r401: 'brick', hall: 'paint', pantry: 'tilewall', r503: 'paint', office: 'paint', lab: 'paint', floor1: 'brick' };

const mix = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

function drawFloor(g, roomId, tx, ty, base) {
  const x = tx * 16, y = ty * 16;
  const r = pen(g, x, y);
  r(0, 0, 16, 16, base);
  switch (FLOORS[roomId]) {
    case 'planks': { // 木地板：橫向木條，接縫錯開
      for (let i = 0; i < 4; i += 1) {
        r(0, i * 4 + 3, 16, 1, mix(base, 0.82));
        const seam = Math.floor(hash(tx, ty * 4 + i, 1) * 16);
        r(seam, i * 4, 1, 3, mix(base, 0.86));
        if (hash(tx, ty * 4 + i, 2) > 0.6) r((seam + 6) % 14, i * 4 + 1, 3, 1, mix(base, 1.06));
      }
      break;
    }
    case 'tiles': // 大磁磚
      r(0, 15, 16, 1, mix(base, 0.85)); r(15, 0, 1, 16, mix(base, 0.85));
      r(1, 1, 3, 1, mix(base, 1.08));
      break;
    case 'checker':
      if ((tx + ty) % 2) r(0, 0, 16, 16, mix(base, 0.72));
      r(0, 0, 8, 8, (tx + ty) % 2 ? mix(base, 0.72) : mix(base, 1.04));
      r(8, 8, 8, 8, (tx + ty) % 2 ? mix(base, 0.72) : mix(base, 1.04));
      break;
    case 'carpet':
      for (let i = 0; i < 10; i += 1) r(Math.floor(hash(tx, ty, i) * 16), Math.floor(hash(ty, tx, i + 20) * 16), 1, 1, mix(base, i % 2 ? 0.85 : 1.1));
      break;
    case 'lino':
      r(0, 7, 16, 1, mix(base, 0.9)); r(0, 15, 16, 1, mix(base, 0.9));
      r((ty % 2) * 8, 0, 1, 7, mix(base, 0.9)); r(((ty + 1) % 2) * 8, 8, 1, 7, mix(base, 0.9));
      break;
    case 'panels':
      r(0, 0, 16, 1, mix(base, 1.1)); r(0, 0, 1, 16, mix(base, 1.1)); r(0, 15, 16, 1, mix(base, 0.8)); r(15, 0, 1, 16, mix(base, 0.8));
      r(3, 3, 1, 1, mix(base, 0.75)); r(12, 3, 1, 1, mix(base, 0.75)); r(3, 12, 1, 1, mix(base, 0.75)); r(12, 12, 1, 1, mix(base, 0.75));
      break;
    case 'terrazzo':
      for (let i = 0; i < 12; i += 1) r(Math.floor(hash(tx, ty, i) * 15), Math.floor(hash(ty, tx, i + 40) * 15), 1 + (i % 3 === 0), 1, i % 2 ? mix(base, 0.7) : mix(base, 1.15));
      break;
    default:
      if ((tx + ty) & 1) r(0, 0, 16, 16, 'rgba(0,0,0,.06)');
  }
}

function drawWall(g, roomId, tx, ty, base, faceBelow) {
  const x = tx * 16, y = ty * 16;
  const r = pen(g, x, y);
  r(0, 0, 16, 16, base);
  switch (WALLS[roomId]) {
    case 'brick':
      for (let row = 0; row < 4; row += 1) {
        r(0, row * 4 + 3, 16, 1, mix(base, 0.75));
        const off = (row + ty) % 2 ? 4 : 12;
        r(off, row * 4, 1, 3, mix(base, 0.75));
        if (hash(tx, ty * 4 + row, 7) > 0.7) r((off + 3) % 14, row * 4 + 1, 3, 1, mix(base, 1.12));
      }
      break;
    case 'tilewall':
      for (let i = 0; i < 4; i += 1) { r(0, i * 4 + 3, 16, 1, mix(base, 0.85)); r(i * 4 + 3, 0, 1, 16, mix(base, 0.85)); }
      break;
    default: // 油漆牆：上淺下深、底下踢腳板
      r(0, 0, 16, 2, mix(base, 1.12));
      if (hash(tx, ty, 8) > 0.75) r(Math.floor(hash(tx, ty, 9) * 12), 6, 2, 3, mix(base, 0.9)); // 牆上的污漬
  }
  if (faceBelow) { r(0, 12, 16, 4, mix(base, 0.6)); r(0, 12, 16, 1, mix(base, 0.45)); } // 牆腳陰影／踢腳板
}

function drawDoorTile(g, tx, ty) {
  const r = pen(g, tx * 16, ty * 16);
  doorShape(r, 0, '#5a3d24', '#8a6338');
}

// ---------- 主角（連帽衫學生）：四個方向，走路兩格 ----------
function drawHero(g, x, y, facing, frame) {
  const r = pen(g, Math.round(x) - 5, Math.round(y) - 12);
  const moving = frame >= 0; // frame < 0 代表站著不動
  const step = moving ? frame % 2 : 0;
  r(1, 15, 9, 2, P.shadow);
  // 腳：上下走時兩腳輪流抬起；左右走時前後腳交換
  const side = facing === 'left' || facing === 'right';
  if (side) {
    const a = moving && step ? 2 : 0;
    r(2 + a, 12, 3, 3, '#3d4a7a'); r(6 - a, 12, 3, 3, '#2d3550');
    r(2 + a, 14, 3, 1, P.ol); r(6 - a, 14, 3, 1, P.ol);
  } else {
    const up1 = moving && step, up2 = moving && !step;
    r(2, 12, 3, up1 ? 2 : 3, '#2d3550'); r(6, 12, 3, up2 ? 2 : 3, '#2d3550');
    r(2, up1 ? 13 : 14, 3, 1, P.ol); r(6, up2 ? 13 : 14, 3, 1, P.ol);
  }
  // 身體（紅色連帽衫）
  r(1, 6, 9, 7, P.ol);
  r(2, 6, 7, 6, '#e56b6f');
  r(2, 11, 7, 1, '#b84a52');
  // 手（擺動）
  const arm = moving && step ? 1 : 0;
  if (facing === 'down' || facing === 'up') { r(0, 7 + arm, 2, 4, '#e56b6f'); r(9, 8 - arm, 2, 4, '#e56b6f'); }
  else r(facing === 'left' ? 6 : 3, 7 + arm, 2, 4, '#c85a60');
  // 頭
  r(1, 0, 9, 7, P.ol);
  r(2, 1, 7, 5, P.skin);
  r(2, 0, 7, 2, P.hair);
  if (facing === 'up') r(2, 0, 7, 6, P.hair);
  if (facing === 'left') { r(5, 1, 4, 4, P.hair); r(3, 3, 1, 1, P.ol); }
  if (facing === 'right') { r(2, 1, 4, 4, P.hair); r(7, 3, 1, 1, P.ol); }
  if (facing === 'down') { r(3, 3, 1, 2, P.ol); r(7, 3, 1, 2, P.ol); r(4, 5, 3, 1, '#d99a7a'); }
  // 背包帶
  if (facing === 'down') { r(3, 7, 1, 4, '#3a3f55'); r(7, 7, 1, 4, '#3a3f55'); }
  if (facing === 'up') r(3, 7, 5, 5, '#3a3f55');
}

__exports.drawSprite = drawSprite;
__exports.drawFloor = drawFloor;
__exports.drawWall = drawWall;
__exports.drawDoorTile = drawDoorTile;
__exports.drawHero = drawHero;
__exports.PAL = PAL;
__exports.SPRITE_IDS = SPRITE_IDS;

});

__def("game/ui/world/logic.js", function (__require, __exports) {
// 走動畫面的純邏輯：碰撞、靠近物件、門、互動要送什麼動作。不碰 DOM，可以用 node:test 測。
const { TILE } = __require("game/ui/maps.js");

const PLAYER_HALF = 5;   // 角色碰撞框是 10x10 像素
const SPEED = 64;        // 像素 / 秒
const REACH = 10;        // 角色中心到物件外框的距離在這之內才能互動

const tileAt = (map, tx, ty) => (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h ? '#' : map.tiles[ty][tx]);
const objRect = (ob) => ({ x0: ob.x * TILE, y0: ob.y * TILE, x1: (ob.x + ob.w) * TILE, y1: (ob.y + ob.h) * TILE });

/** 中心在 (cx, cy) 的角色框會不會撞到牆或實心物件。 */
function collides(map, cx, cy, half = PLAYER_HALF) {
  const x0 = cx - half, x1 = cx + half, y0 = cy - half, y1 = cy + half;
  for (let ty = Math.floor(y0 / TILE); ty <= Math.floor((y1 - 0.001) / TILE); ty += 1) {
    for (let tx = Math.floor(x0 / TILE); tx <= Math.floor((x1 - 0.001) / TILE); tx += 1) {
      if (tileAt(map, tx, ty) === '#') return true;
    }
  }
  for (const ob of map.objects) {
    if (!ob.solid) continue;
    const r = objRect(ob);
    if (x0 < r.x1 && x1 > r.x0 && y0 < r.y1 && y1 > r.y0) return true;
  }
  return false;
}

const ASSIST = 4; // 差幾像素就能過的窄門，自動往旁邊帶一點

/** 移動 (dx, dy)：X、Y 分開處理，撞到就停在那一軸（可以貼著牆滑）；對不準門口時會自動修正。 */
function move(map, pos, dx, dy) {
  let { x, y } = pos;
  if (dx) {
    if (!collides(map, x + dx, y)) x += dx;
    else for (let s = 1; s <= ASSIST; s += 1) {
      const side = [s, -s].find((o) => !collides(map, x + dx, y + o));
      if (side !== undefined) { y += Math.sign(side) * Math.min(Math.abs(dx), 1); break; }
    }
  }
  if (dy) {
    if (!collides(map, x, y + dy)) y += dy;
    else for (let s = 1; s <= ASSIST; s += 1) {
      const side = [s, -s].find((o) => !collides(map, x + o, y + dy));
      if (side !== undefined) { x += Math.sign(side) * Math.min(Math.abs(dy), 1); break; }
    }
  }
  return { x, y };
}

const distToRect = (px, py, r) => Math.hypot(Math.max(r.x0 - px, 0, px - r.x1), Math.max(r.y0 - py, 0, py - r.y1));

/** 距離最近、在 REACH 內的可互動物件（裝飾不算），沒有就回 null。 */
function nearestObject(map, pos, reach = REACH) {
  let best = null;
  let bestD = Infinity;
  for (const ob of map.objects) {
    if (ob.deco) continue;
    const d = distToRect(pos.x, pos.y, objRect(ob));
    if (d <= reach && d < bestD) { best = ob; bestD = d; }
  }
  return best;
}

/** 角色中心所在的格子如果是門，回傳那扇門。 */
function doorAt(map, pos) {
  const tx = Math.floor(pos.x / TILE), ty = Math.floor(pos.y / TILE);
  if (tileAt(map, tx, ty) !== 'D') return null;
  return map.doors.find((d) => d.x === tx && d.y === ty) ?? null;
}

/**
 * 走進門格時要送的動作。401 的門在警衛鎖門前其實沒鎖：直接走出去就是「門其實沒鎖」（記一筆死法，重來後繼續），
 * 和點左上角的「門」一樣；鎖門之後才是一般的換房間（要後門鑰匙）。
 */
function doorAction(roomId, door, state) {
  if (roomId === 'r401' && !state.doorLocked) return { type: 'DOOR' };
  return { type: 'GO', room: door.to };
}

/** 門前面（房間裡面）那一格的中心座標。 */
function doorFront(map, door) {
  for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    if (tileAt(map, door.x + dx, door.y + dy) === '.') return { x: (door.x + dx + 0.5) * TILE, y: (door.y + dy + 0.5) * TILE };
  }
  return { x: (door.x + 0.5) * TILE, y: (door.y + 0.5) * TILE };
}

/** 進房間時站在哪：從哪個房間來就站在通往那裡的門前；沒有就站在第一扇門前。 */
function spawnFor(map, fromRoom) {
  const door = map.doors.find((d) => d.to === fromRoom) ?? map.doors[0];
  return doorFront(map, door);
}

/** 把物件 id 對回資料：{ kind, ... }。找不到回 null。 */
function resolveObject(content, roomId, id) {
  if (id === 'door' || id === 'phone' || id === 'hint') return { kind: id, name: { door: '大門', phone: '手機', hint: 'AI 助教' }[id] };
  const puzzle = content.puzzles.find((p) => p.object === id);
  if (puzzle) return { kind: 'puzzle', puzzle, name: puzzle.title };
  if (content.eggById[id]) return { kind: 'egg', egg: content.eggById[id], name: content.eggById[id].name };
  const clue = content.rooms.byId[roomId]?.clues.find((c) => c.id === id);
  if (clue) return { kind: 'clue', clue, name: clue.name };
  return null;
}

/**
 * 按 E 要做什麼（和 rooms-panel 清單點同一個物件完全一樣）：
 *  { do: 'send', action }    送動作給核心（DOOR / PHONE / HINT）
 *  { do: 'egg', egg }        開彩蛋對話框，按 actionLabel 才送 { type:'EGG', egg }
 *  { do: 'open_puzzle', puzzle }  發 ui_open_puzzle 事件
 *  { do: 'text', title, text }    純文字
 */
function planInteraction(res, game, content) {
  switch (res.kind) {
    case 'door': return { do: 'send', action: { type: 'DOOR' } };
    case 'phone': return { do: 'send', action: { type: 'PHONE' } };
    case 'hint': return { do: 'send', action: { type: 'HINT' } };
    case 'egg': return { do: 'egg', egg: res.egg };
    case 'clue': return { do: 'text', title: res.clue.name, text: res.clue.text };
    case 'puzzle': {
      const p = res.puzzle;
      if (game.isSolved(p.id)) return { do: 'text', title: p.title, text: '這關已經解開了。' };
      if (game.puzzleAvailable(p.id)) return { do: 'open_puzzle', puzzle: p.id };
      const clues = content.rooms.list.flatMap((r) => r.clues).filter((c) => c.forPuzzle === p.id);
      return { do: 'text', title: '還不能解', text: '相關線索：\n' + (clues.map((c) => `・${c.name}：${c.text}`).join('\n') || '（無）') };
    }
    default: return null;
  }
}

/** 被擋下的門要顯示什麼（核心的 blocked 事件只給條件，沒有文字）。 */
function blockedText(ev, content) {
  const r = ev.requires ?? {};
  const parts = [];
  if (r.items?.length) parts.push('需要鑰匙或道具');
  if (r.puzzles?.length) parts.push(`需要先解開：${r.puzzles.map((id) => content.puzzleById[id]?.title ?? id).join('、')}`);
  if (r.flags?.length) parts.push('還沒滿足條件');
  return `門鎖著。${parts.join('；')}`;
}

/** 檢查地圖和資料對得上，回傳錯誤陣列（空的就是沒問題）。 */
function checkMaps(maps, content) {
  const errs = [];
  const need = new Map(); // roomId -> Set(objectId)
  const add = (room, id) => { if (!need.has(room)) need.set(room, new Set()); need.get(room).add(id); };
  for (const p of content.puzzles) add(p.room, p.object);
  for (const e of content.eggs) add(e.room, e.id);
  for (const r of content.rooms.list) for (const c of r.clues) add(r.id, c.id);
  add('r401', 'door'); add('r401', 'phone'); add('r401', 'hint');

  for (const r of content.rooms.list) {
    const map = maps[r.id];
    if (!map) { errs.push(`缺少房間地圖：${r.id}`); continue; }
    const ids = map.objects.filter((ob) => !ob.deco).map((ob) => ob.id);
    for (const id of need.get(r.id) ?? []) if (!ids.includes(id)) errs.push(`${r.id} 缺少物件 ${id}`);
    for (const id of ids) {
      if (!resolveObject(content, r.id, id)) errs.push(`${r.id} 的物件 ${id} 在資料裡找不到`);
    }
    // 門要和 rooms.json 的 exits 一致
    const exits = [...new Set(map.doors.map((d) => d.to))].sort();
    if (exits.join() !== [...r.exits].sort().join()) errs.push(`${r.id} 的門 [${exits}] 和 exits [${r.exits}] 不一致`);
    // 物件不能重疊、不能超出地圖
    const seen = new Map();
    for (const ob of map.objects) {
      if (ob.x < 0 || ob.y < 0 || ob.x + ob.w > map.w || ob.y + ob.h > map.h) errs.push(`${r.id} 的 ${ob.id} 超出地圖`);
      for (let y = ob.y; y < ob.y + ob.h; y += 1) {
        for (let x = ob.x; x < ob.x + ob.w; x += 1) {
          const k = `${x},${y}`;
          if (seen.has(k)) errs.push(`${r.id} 的 ${ob.id} 和 ${seen.get(k)} 重疊於 ${k}`);
          seen.set(k, ob.id);
          if (tileAt(map, x, y) === 'D') errs.push(`${r.id} 的 ${ob.id} 壓在門上`);
        }
      }
    }
    // 從出生點走得到每扇門，也走得到每個物件旁邊
    const reach = reachableTiles(map, spawnFor(map, map.doors[0].to));
    for (const d of map.doors) if (!reach.has(`${d.x},${d.y}`)) errs.push(`${r.id} 走不到門 ${d.to}`);
    for (const ob of map.objects) {
      if (ob.deco) continue;
      if (!touchesReach(map, ob, reach)) errs.push(`${r.id} 走不到物件 ${ob.id}`);
    }
  }
  return errs;
}

// 以「格」為單位的可走區域（角色 10px 小於 1 格，單格寬的走道也過得去）
function reachableTiles(map, startPx) {
  const blocked = new Set();
  for (const ob of map.objects) {
    if (!ob.solid) continue;
    for (let y = ob.y; y < ob.y + ob.h; y += 1) for (let x = ob.x; x < ob.x + ob.w; x += 1) blocked.add(`${x},${y}`);
  }
  const ok = (x, y) => tileAt(map, x, y) !== '#' && !blocked.has(`${x},${y}`);
  const start = [Math.floor(startPx.x / TILE), Math.floor(startPx.y / TILE)];
  const seen = new Set([start.join()]);
  const queue = [start];
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (ok(nx, ny) && !seen.has(`${nx},${ny}`)) { seen.add(`${nx},${ny}`); queue.push([nx, ny]); }
    }
  }
  return seen;
}

function touchesReach(map, ob, reach) {
  for (let y = ob.y - 1; y <= ob.y + ob.h; y += 1) {
    for (let x = ob.x - 1; x <= ob.x + ob.w; x += 1) {
      const inside = x >= ob.x && x < ob.x + ob.w && y >= ob.y && y < ob.y + ob.h;
      if (!inside && reach.has(`${x},${y}`)) return true;
    }
  }
  return false;
}

__exports.collides = collides;
__exports.move = move;
__exports.nearestObject = nearestObject;
__exports.doorAt = doorAt;
__exports.doorAction = doorAction;
__exports.doorFront = doorFront;
__exports.spawnFor = spawnFor;
__exports.resolveObject = resolveObject;
__exports.planInteraction = planInteraction;
__exports.blockedText = blockedText;
__exports.checkMaps = checkMaps;
__exports.PLAYER_HALF = PLAYER_HALF;
__exports.SPEED = SPEED;
__exports.REACH = REACH;
__exports.tileAt = tileAt;
__exports.objRect = objRect;

});

__def("game/ui/world/index.js", function (__require, __exports) {
// Canvas 地圖、角色走動、碰撞、靠近物件按 E 互動（WP2）。
// 低解析度內部畫布（1 格 = 16 像素），整數倍放大。只讀狀態、只送動作；
// 謎題浮層、死因卡、結局顯示期間（WP3／WP5）暫停輸入。
const { MAPS, TILE } = __require("game/ui/maps.js");
const { getAsset, getImage } = __require("game/ui/assets.js");
const { skyColor, darkness } = __require("game/ui/flavor-logic.js");
const { drawSprite, drawFloor, drawWall, drawDoorTile, drawHero, SPRITE_IDS } = __require("game/ui/world/sprites.js");
const { SPEED, move, nearestObject, doorAt, doorAction, doorFront, spawnFor, resolveObject, planInteraction, blockedText, objRect, tileAt } = __require("game/ui/world/logic.js");

const KEYS = {
  ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right',
};
const VEC = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const MIN_HOLD = 70; // 點一下方向鍵至少走這麼久（毫秒），不然輕點會幾乎不動

// ---------- 氣氛設定（之後換素材時可以調） ----------
// 每個房間的基本暗度；走廊要等第 3 關開燈才會亮
const ROOM_DARK = { r401: 0.5, hall: 0.84, pantry: 0.6, r503: 0.62, office: 0.6, lab: 0.56, floor1: 0.66 };
// 會發光的物件：[顏色, 半徑像素]
const LIGHTS = {
  laptop: ['#9ec3ff', 40], hint: ['#f0b429', 18], phone: ['#3ec28f', 16],
  vending: ['#ff7a7a', 54], switch_panel: ['#ffe27a', 22], keypad: ['#7fffa0', 20],
  lab_pc: ['#8fb8ff', 42], e_restore: ['#8fb8ff', 26], e_sync: ['#8fb8ff', 26], e_seniorcode: ['#8fb8ff', 30],
  broadcast: ['#ff9ad0', 30], e_guardpc: ['#8fb8ff', 24], c_guard: ['#ffd28a', 46], e_printer: ['#cfe0ff', 18],
};
const SCREENS = { laptop: 1, lab_pc: 1, e_restore: 1, e_sync: 1, e_seniorcode: 1, e_guardpc: 1 };
const SLEEPERS = ['c_sleeptalk', 'c_guard'];
// 上牆的窗戶（x 座標；被物件或門佔住、不是牆就不畫）
const WINDOWS = { r401: [3, 4, 8], hall: [1, 22], pantry: [2, 3, 8], r503: [6, 7], office: [2, 3, 10], lab: [6, 7, 13, 14], floor1: [9, 10] };
const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

const SPRITE_SET = new Set(SPRITE_IDS);
const SPRITE_DRAWN = (ob) => SPRITE_SET.has(ob.id);
const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

function initWorld(ctx, root) {
  const { game, content, bus, send, debug } = ctx;

  const link = document.createElement('style');
  link.textContent = __CSS["game/ui/world/world.css"];
  document.head.append(link);

  // 房間清單面板預設收起來，只在 ?debug=1 顯示（可用右上角按鈕切換）；不動 rooms-panel 本身
  const app = document.getElementById('app');
  const panel = document.getElementById('rooms-root');
  const setPanel = (show) => { panel.hidden = !show; app.classList.toggle('wd-solo', !show); };
  setPanel(debug);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const wrap = el('div', 'wd');
  const canvas = el('canvas', 'wd-canvas');
  const g = canvas.getContext('2d');
  const prompt = el('div', 'wd-prompt');
  const toast = el('div', 'wd-toast');
  const roomName = el('div', 'wd-room');
  const stage = el('div', 'wd-stage');
  stage.append(canvas, prompt, toast);
  wrap.append(roomName, stage, el('div', 'wd-help', '方向鍵／WASD 走動　E 互動'));
  if (debug) {
    const t = el('button', 'wd-panel-btn', '房間清單');
    t.type = 'button';
    t.addEventListener('click', () => setPanel(panel.hidden));
    wrap.append(t);
  }
  root.append(wrap);

  // ---------- 狀態 ----------
  let roomId = null;
  let map = null;
  let pos = { x: 0, y: 0 };
  let facing = 'down';
  let walk = 0;                 // 走路動畫用的累計距離
  let near = null;              // 目前靠近的物件
  let modal = null;             // 自己的對話框（彩蛋、線索）
  const held = new Map();       // 方向 -> { since, up }
  let scale = 3;
  let toastTimer = null;
  let lastMoveAt = 0;           // 最後一次真的有移動的時間（走路動畫用）
  let stepAcc = 0;              // 腳步聲：累計走了幾像素
  let lastBump = 0;             // 上次撞牆的時間
  let shakeUntil = 0;           // 撞牆時畫面抖一下

  const showToast = (text) => {
    toast.textContent = text;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('on'), 3200);
  };

  function loadRoom(id, from) {
    roomId = id;
    map = MAPS[id];
    pos = spawnFor(map, from);
    held.clear();
    near = null;
    canvas.width = map.w * TILE;
    canvas.height = map.h * TILE;
    roomName.textContent = content.rooms.byId[id]?.name ?? id;
    fit();
    if (from) { // 換房間：黑一下再亮
      stage.classList.remove('wd-fade');
      void stage.offsetWidth;
      stage.classList.add('wd-fade');
    }
  }

  function fit() {
    if (!map) return;
    const availW = Math.max(root.clientWidth - 16, TILE * map.w);
    const top = root.getBoundingClientRect().top;
    const availH = Math.max(window.innerHeight - top - 80, TILE * map.h);
    scale = Math.max(1, Math.min(Math.floor(availW / canvas.width), Math.floor(availH / canvas.height), 6));
    canvas.style.width = `${canvas.width * scale}px`;
    canvas.style.height = `${canvas.height * scale}px`;
  }
  window.addEventListener('resize', fit);
  new ResizeObserver(fit).observe(root); // 樣式載入完、面板收合時寬度會變

  // 狀態裡的房間和畫面不同就換（清單、除錯跳關、重新開始都會走這裡）
  function syncRoom() {
    const st = game.getState();
    if (st.room !== roomId && MAPS[st.room]) loadRoom(st.room, roomId);
  }

  // ---------- 暫停判斷 ----------
  const overlayOpen = () => !!document.querySelector('#puzzle-root .pz-overlay, #screen-root .sc-overlay');
  const paused = () => game.getState().phase !== 'playing' || !!modal || overlayOpen();

  // ---------- 對話框（彩蛋、線索） ----------
  function closeModal() {
    if (!modal) return;
    modal.node.remove();
    modal = null;
    wrap.focus({ preventScroll: true });
  }
  function openModal({ title, text, buttons }) {
    closeModal();
    const node = el('div', 'wd-modal');
    const card = el('div', 'wd-card');
    card.append(el('strong', '', title), el('p', '', text));
    const row = el('div', 'wd-row');
    for (const b of buttons) {
      const btn = el('button', b.cls || '', b.label);
      btn.type = 'button';
      btn.addEventListener('click', () => { closeModal(); b.fn?.(); });
      row.append(btn);
    }
    card.append(row);
    node.append(card);
    wrap.append(node);
    modal = { node };
    held.clear();
    row.lastElementChild.focus({ preventScroll: true }); // 預設停在最後一顆（算了／關閉），不會手滑
  }

  // ---------- 互動：和 rooms-panel 清單點同一個物件送一樣的動作 ----------
  function interact() {
    if (!near) return;
    const res = resolveObject(content, roomId, near.id);
    const plan = res && planInteraction(res, game, content);
    if (!plan) return;
    bus.emit([{ type: 'ui_interact', id: near.id, kind: plan.do }]); // 給音效和台詞用
    held.clear();
    if (plan.do === 'send') send(plan.action);
    else if (plan.do === 'open_puzzle') bus.emit([{ type: 'ui_open_puzzle', puzzle: plan.puzzle }]);
    else if (plan.do === 'text') openModal({ title: plan.title, text: plan.text, buttons: [{ label: '關閉', cls: 'primary' }] });
    else if (plan.do === 'egg') {
      const e = plan.egg;
      openModal({
        title: e.name, text: e.look,
        buttons: [{ label: e.actionLabel, fn: () => send({ type: 'EGG', egg: e.id }) }, { label: '算了', cls: 'primary' }],
      });
    }
  }

  // ---------- 鍵盤 ----------
  const typing = (t) => t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
    if (modal) {
      if (e.key === 'Escape') { closeModal(); e.preventDefault(); }
      return;
    }
    if (paused()) return;
    const dir = KEYS[e.key];
    if (dir) {
      e.preventDefault();
      const h = held.get(dir);
      if (!h || h.up) held.set(dir, { since: performance.now(), up: false });
    } else if ((e.key === 'e' || e.key === 'E') && !e.repeat) {
      interact();
    }
  });
  window.addEventListener('keyup', (e) => {
    const dir = KEYS[e.key];
    const h = dir && held.get(dir);
    if (h) h.up = true;
  });
  window.addEventListener('blur', () => held.clear());

  // ---------- 事件 ----------
  bus.on('_flush', syncRoom);
  bus.on('blocked', (ev) => showToast(blockedText(ev, content)));
  bus.on('message', (ev) => { if (!overlayOpen()) showToast(ev.text); });
  // AI 助教回覆改由 HUD（hud/index.js）顯示，這裡不再重複彈提示
  bus.on('death', closeModal);
  bus.on('ending', closeModal);
  // 新的一局：就算還在同一個房間，也要回到起點（不然會接著站在上一局的位置）
  bus.on('new_run', () => { closeModal(); held.clear(); const st = game.getState(); if (MAPS[st.room]) loadRoom(st.room, null); });
  bus.on('debug', (ev) => { if (ev.did === 'jump') { const st = game.getState(); if (MAPS[st.room]) loadRoom(st.room, null); } });

  // ---------- 每一幀 ----------
  let last = performance.now();
  function step(ms) {
    syncRoom();
    if (!map) return;
    if (paused()) { held.clear(); near = null; return; }
    const now = performance.now();
    let dx = 0, dy = 0;
    for (const [dir, h] of held) {
      if (h.up && now - h.since >= MIN_HOLD) { held.delete(dir); continue; }
      dx += VEC[dir][0];
      dy += VEC[dir][1];
      facing = dir;
    }
    if (dx || dy) {
      const len = Math.hypot(dx, dy);
      const dist = (SPEED * ms) / 1000;
      const n = Math.max(1, Math.ceil(dist / 2)); // 切小步，避免穿牆
      const before = pos;
      for (let i = 0; i < n; i += 1) pos = move(map, pos, (dx / len) * (dist / n), (dy / len) * (dist / n));
      const moved = Math.hypot(pos.x - before.x, pos.y - before.y);
      walk += moved;
      if (moved > 0.01) lastMoveAt = now;
      // 腳步聲和撞牆：直接呼叫音效，不走事件
      stepAcc += moved;
      if (stepAcc > 14) { stepAcc = 0; ctx.sfx?.('step'); }
      if (moved < 0.01 && now - lastBump > 380) { lastBump = now; shakeUntil = now + 140; ctx.sfx?.('bump'); }
      if (Math.abs(dx) !== Math.abs(dy) || !(dx && dy)) facing = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');

      const door = doorAt(map, pos);
      if (door) {
        const from = roomId;
        send(doorAction(roomId, door, game.getState()));
        if (roomId === from) { pos = doorFront(map, door); held.clear(); } // 被擋下：退回門前、放開按鍵，訊息由 blocked 事件顯示
      }
    }
    near = nearestObject(map, pos);
  }

  function frame(t) {
    const ms = Math.min(50, t - last);
    last = t;
    step(ms);
    draw();
    canvas.style.transform = t < shakeUntil ? `translate(${(Math.random() < 0.5 ? -1 : 1) * scale}px, 0)` : '';
    requestAnimationFrame(frame);
  }

  // ---------- 繪製（全部是程式畫的佔位圖形） ----------
  function draw() {
    if (!map) return;
    const st = game.getState();
    g.imageSmoothingEnabled = false;
    g.fillStyle = '#0d0e13';
    g.fillRect(0, 0, canvas.width, canvas.height);
    for (let ty = 0; ty < map.h; ty += 1) {
      for (let tx = 0; tx < map.w; tx += 1) drawTile(tx, ty, tileAt(map, tx, ty));
    }
    const now = performance.now();
    drawWindows(st, now);
    const items = map.objects.map((ob) => ({ y: (ob.y + ob.h) * TILE, fn: () => drawObject(ob, st) }));
    items.push({ y: pos.y + 6, fn: drawPlayer });
    items.sort((a, b) => a.y - b.y);
    for (const it of items) it.fn();
    drawAmbient(now);
    drawLighting(st, now);
    placePrompt();
  }

  function drawTile(tx, ty, ch) {
    if (ch === '#') return drawWall(g, roomId, tx, ty, map.wall, tileAt(map, tx, ty + 1) !== '#');
    drawFloor(g, roomId, tx, ty, map.floor);
    if (ch === 'D') drawDoorTile(g, tx, ty);
  }

  function drawObject(ob, st) {
    const r = objRect(ob);
    const w = r.x1 - r.x0, h = r.y1 - r.y0;
    const img = getImage(ob.id);   // 素材表有填 src 而且載入成功才有圖，否則畫下面的色塊
    const color = getAsset(ob.id).color !== '#888' ? getAsset(ob.id).color : ob.color;
    if (img) {
      g.drawImage(img, r.x0, r.y0, w, h);
    } else if (drawSprite(g, ob, r, performance.now())) {
      // 程式畫的像素圖（sprites.js）
    } else {
      g.fillStyle = 'rgba(0,0,0,.22)';
      g.fillRect(r.x0 + 1, r.y0 + 2, w, h);
      g.fillStyle = shade(color, ob.deco ? 0.75 : 0.62);
      g.fillRect(r.x0 + 1, r.y0 + 1, w - 2, h - 1);
      g.fillStyle = color;
      g.fillRect(r.x0 + 2, r.y0 + 2, w - 4, h - 5);
      g.fillStyle = 'rgba(255,255,255,.28)';
      g.fillRect(r.x0 + 2, r.y0 + 2, w - 4, 1);
    }
    if (ob.icon && !img && !SPRITE_DRAWN(ob)) {
      g.font = '12px "Pixel Font", "Microsoft JhengHei", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillStyle = shade(color, 0.3);
      g.fillText(ob.icon, r.x0 + w / 2, r.y0 + h / 2 - 1);
    }
    const res = ob.deco ? null : resolveObject(content, roomId, ob.id);
    if (res?.kind === 'puzzle' && game.isSolved(res.puzzle.id)) {
      g.fillStyle = '#3ec28f';
      g.fillRect(r.x1 - 6, r.y0 + 1, 5, 5);
      g.fillStyle = '#0b2a1f';
      g.fillRect(r.x1 - 5, r.y0 + 3, 1, 1); g.fillRect(r.x1 - 4, r.y0 + 4, 1, 1); g.fillRect(r.x1 - 3, r.y0 + 2, 1, 2);
    }
    if (ob === near) {
      g.strokeStyle = (Math.floor(performance.now() / 300) & 1) ? '#ffe27a' : '#ffffff';
      g.lineWidth = 1;
      g.strokeRect(r.x0 + 0.5, r.y0 + 0.5, w - 1, h - 1);
    }
  }

  function drawPlayer() {
    const img = getImage('player');
    if (img) { g.drawImage(img, Math.round(pos.x) - 8, Math.round(pos.y) - 11, 16, 16); return; } // 16×16，腳底對齊角色位置
    const moving = performance.now() - lastMoveAt < 120;
    drawHero(g, pos.x, pos.y, facing, moving ? Math.floor(walk / 5) : -1);
  }

  // ---------- 氣氛：窗外天色、燈光、小動畫（全部程式畫，之後有素材也能疊在上面） ----------
  const objAt = (x, y) => map.objects.some((o) => x >= o.x && x < o.x + o.w && y >= o.y && y < o.y + o.h);
  function drawWindows(st, now) {
    const sky = skyColor(st.clock);
    const night = st.clock < 330;
    for (const x of WINDOWS[roomId] ?? []) {
      if (tileAt(map, x, 0) !== '#' || objAt(x, 0) || map.doors.some((d) => d.x === x && d.y === 0)) continue;
      const px = x * TILE;
      g.fillStyle = '#20232c';
      g.fillRect(px + 1, 2, TILE - 2, 11);
      g.fillStyle = sky;
      g.fillRect(px + 2, 3, TILE - 4, 9);
      if (night) { // 星星一閃一閃
        g.fillStyle = '#ffffff';
        for (let k = 0; k < 2; k += 1) {
          const sx = px + 3 + ((x * 7 + k * 5) % 10), sy = 4 + ((x * 3 + k * 4) % 6);
          if (Math.sin(now / 400 + x * 1.7 + k * 2.3) > 0.2) g.fillRect(sx, sy, 1, 1);
        }
      }
      g.fillStyle = '#20232c';
      g.fillRect(px + 7, 3, 1, 9); // 窗框
    }
  }

  function drawAmbient(now) {
    for (const ob of map.objects) {
      const r = objRect(ob);
      if (SLEEPERS.includes(ob.id)) { // 睡覺的人頭上冒 z
        g.font = '12px "Pixel Font", monospace';
        g.textAlign = 'center';
        g.textBaseline = 'alphabetic';
        for (let k = 0; k < 3; k += 1) {
          const p = ((now / 2400) + k / 3) % 1;
          g.fillStyle = `rgba(255,255,255,${(1 - p) * 0.9})`;
          g.fillText('z', r.x1 - 2 + p * 6, r.y0 - 1 - p * 12);
        }
      }
      if (ob.id === 'vending') { // 販賣機的小燈
        g.fillStyle = Math.floor(now / 500) % 2 ? '#7fffa0' : '#1d4a2a';
        g.fillRect(r.x1 - 5, r.y0 + 3, 2, 2);
      }
      if (SCREENS[ob.id]) { // 螢幕的光微微閃
        g.fillStyle = `rgba(160,200,255,${0.25 + 0.15 * Math.sin(now / 300 + r.x0)})`;
        g.fillRect(r.x0 + 3, r.y0 + 3, r.x1 - r.x0 - 6, 4);
      }
    }
  }

  const fog = document.createElement('canvas');
  const fg = fog.getContext('2d');
  let flickerUntil = 0;
  function drawLighting(st, now) {
    let base = ROOM_DARK[roomId] ?? 0.5;
    if (roomId === 'hall' && st.flags.hall_lit) {
      base = 0.28;
      if (now > flickerUntil && Math.random() < 0.006) flickerUntil = now + 90 + Math.random() * 160; // 日光燈閃一下
      if (now < flickerUntil) base = 0.7;
    }
    const a = darkness(base, st.clock);
    if (a <= 0.02) return;
    if (fog.width !== canvas.width || fog.height !== canvas.height) { fog.width = canvas.width; fog.height = canvas.height; }
    fg.globalCompositeOperation = 'source-over';
    fg.clearRect(0, 0, fog.width, fog.height);
    fg.fillStyle = `rgba(6,8,24,${a})`;
    fg.fillRect(0, 0, fog.width, fog.height);
    fg.globalCompositeOperation = 'destination-out';
    const lights = [{ x: pos.x, y: pos.y - 2, r: 46 }]; // 手機手電筒
    for (const ob of map.objects) {
      const L = LIGHTS[ob.id];
      if (!L) continue;
      const r = objRect(ob);
      lights.push({ x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2, r: L[1] * (1 + 0.06 * Math.sin(now / 260 + r.x0)), color: L[0] });
    }
    if (roomId === 'hall' && !st.flags.hall_lit) { // 緊急出口的綠燈
      for (const d of map.doors) lights.push({ x: (d.x + 0.5) * TILE, y: (d.y + 0.5) * TILE, r: 20, color: '#3dff8a' });
    }
    for (const L of lights) {
      const gr = fg.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r);
      gr.addColorStop(0, 'rgba(0,0,0,1)');
      gr.addColorStop(0.55, 'rgba(0,0,0,.7)');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      fg.fillStyle = gr;
      fg.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2);
    }
    g.drawImage(fog, 0, 0);
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (const L of lights) {
      if (!L.color) continue;
      const gr = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r * 0.8);
      gr.addColorStop(0, hexA(L.color, 0.22 * a + 0.04));
      gr.addColorStop(1, hexA(L.color, 0));
      g.fillStyle = gr;
      g.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2);
    }
    g.restore();
  }

  // 名牌：浮在靠近的物件上方（DOM，字才清楚）
  function placePrompt() {
    if (!near || paused()) { prompt.classList.remove('on'); return; }
    const res = resolveObject(content, roomId, near.id);
    prompt.textContent = `[E] ${res?.name ?? near.id}`;
    const r = objRect(near);
    prompt.style.left = `${((r.x0 + r.x1) / 2) * scale}px`;
    prompt.style.top = `${Math.max(r.y0 * scale - 6, 14)}px`;
    prompt.classList.add('on');
  }

  syncRoom();
  if (!map) loadRoom(content.rooms.start, null);
  requestAnimationFrame(frame);

  // 除錯用：?debug=1 時掛出來，方便在 console 檢查位置
  if (debug) window.__world = { get room() { return roomId; }, get pos() { return { ...pos }; }, step, teleport: (x, y) => { pos = { x, y }; } };
}

__exports.initWorld = initWorld;

});

__def("game/ui/puzzles/moodle-logic.js", function (__require, __exports) {
// 第 7 關假 Moodle 的純邏輯（不碰 DOM，方便測試）：每一步顯示哪個畫面、右上角狀態、各點擊要送什麼。

// 遊戲裡的假帳號（登入頁自動填好的「上一個人」）。不是真實學號。
const FAKE_ACCOUNT = 's1130042';
const FAKE_PASSWORD_MASK = '••••••••';

/** 這一步的畫面代號：course／course+dialog／login／home。 */
function screenFor(moodle, stageId) {
  return moodle.stageScreens[stageId] || 'course';
}

/** 右上角是不是訪客：按了「繳交」之後到登入完成之前都是。 */
function isGuest(stageId) {
  return ['guest_dialog', 'login_choice', 'login'].includes(stageId);
}

/** 這一步登入頁是「自動填好」（login_choice）還是「自己輸入」（login）。 */
function loginMode(stageId) {
  return stageId === 'login_choice' ? 'autofill' : 'manual';
}

/** 這一步有沒有這個選項（UI 的點擊要對得上資料，沒有就不送）。 */
function hasOption(stage, optionId) {
  return stage?.type === 'choice' && stage.options.some((o) => o.id === optionId);
}

/** 點擊要送的 PUZZLE 動作；選項不存在回 null。 */
function choiceAction(pid, stage, optionId) {
  return hasOption(stage, optionId) ? { type: 'PUZZLE', puzzle: pid, value: optionId } : null;
}

/** 登入步驟送的動作：密碼＋「記住帳號」勾選。 */
function loginAction(pid, password, remember) {
  return { type: 'PUZZLE', puzzle: pid, value: { answer: String(password).trim(), checks: { remember: !!remember } } };
}

/** 登入頁上哪些點擊在這一步有效，對應 login_choice 的選項 id。 */
function loginChoiceIds() {
  return { guest: 'guest', forgot: 'forgot', contact: 'contact', autofill: 'autofill', clear: 'clear' };
}

/** 行事曆能不能點（只有 find_course 那步）。 */
function calendarOpenable(stageId) {
  return stageId === 'find_course';
}

__exports.screenFor = screenFor;
__exports.isGuest = isGuest;
__exports.loginMode = loginMode;
__exports.hasOption = hasOption;
__exports.choiceAction = choiceAction;
__exports.loginAction = loginAction;
__exports.loginChoiceIds = loginChoiceIds;
__exports.calendarOpenable = calendarOpenable;
__exports.FAKE_ACCOUNT = FAKE_ACCOUNT;
__exports.FAKE_PASSWORD_MASK = FAKE_PASSWORD_MASK;

});

__def("game/ui/puzzles/moodle.js", function (__require, __exports) {
// 第 7 關的假 Moodle 皮（WP4）。由 index.js 在 p7 開出來時呼叫 createMoodle(...).render(stage, note, shake)。
// 畫面文字與配色都來自 content/moodle.json；判定在核心，這裡只送動作。
const { screenFor, isGuest, loginMode, choiceAction, loginAction, calendarOpenable, FAKE_ACCOUNT, FAKE_PASSWORD_MASK } = __require("game/ui/puzzles/moodle-logic.js");

const OWL = [
  'a........a', 'aa......aa', 'aaaaaaaaaa', 'aWWWaaWWWa', 'aWKWaaWKWa',
  'aWWWyyWWWa', 'aaaaayyaaa', 'aabbbbbbaa', '.aabbbbaa.', '..aa..aa..',
];
const OWL_COLORS = { a: '#c9a46a', W: '#ffffff', K: '#111111', y: '#f0b429', b: '#8a6a3b' };
const SVG_NS = 'http://www.w3.org/2000/svg';

// 國立夜貓大學校徽：像素貓頭鷹（內嵌 SVG，不用外部圖）
function owlLogo() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 10 10');
  svg.setAttribute('class', 'mdl-logo');
  svg.setAttribute('shape-rendering', 'crispEdges');
  OWL.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === '.') return;
    const r = document.createElementNS(SVG_NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 1); r.setAttribute('height', 1);
    r.setAttribute('fill', OWL_COLORS[c]);
    svg.append(r);
  }));
  return svg;
}

function globeIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('class', 'mdl-globe');
  svg.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><ellipse cx="10" cy="10" rx="3.5" ry="8"/><path d="M2 10h16M3.5 6h13M3.5 14h13"/></g>';
  return svg;
}

function createMoodle({ content, send, pid, close, refresh }) {
  const m = content.moodle;
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const btn = (label, fn, cls = '', disabled = false) => {
    const b = el('button', cls, label);
    b.type = 'button';
    b.disabled = disabled;
    b.addEventListener('click', fn);
    return b;
  };

  // 本地狀態：步驟換了就重設（輸入框內容、行事曆是否打開）
  let stageId = '';
  let ui = {};
  const resetUi = () => { ui = { view: 'home', user: '', pass: '', remember: false }; };
  resetUi();

  function render(stage, note, shake) {
    if (stage.id !== stageId) { stageId = stage.id; resetUi(); }
    const screen = screenFor(m, stage.id);
    const guest = isGuest(stage.id);
    const act = (optionId) => { const a = choiceAction(pid, stage, optionId); if (a) send(a); };

    const root = el('div', 'mdl-wrap' + (shake ? ' shake' : ''));
    root.style.setProperty('--mdl-bg', m.theme.background);
    root.style.setProperty('--mdl-bar', m.theme.titleBar);
    root.style.setProperty('--mdl-left', m.theme.loginLeft);
    root.style.setProperty('--mdl-right', m.theme.loginRight);
    root.style.setProperty('--mdl-btn', m.theme.primaryButton);
    root.style.setProperty('--mdl-text', m.theme.text);

    // 旁白列：這一步的提示（不在 Moodle 頁面裡）
    const cap = el('div', 'mdl-caption');
    cap.append(el('span', '', stage.prompt), btn('✕', () => close(), 'mdl-x'));
    root.append(cap);

    const win = el('div', 'mdl-win');
    root.append(win);
    win.append(titleBar(guest));

    if (screen === 'login') win.append(loginPage(stage, act));
    else {
      const body = el('div', 'mdl-body');
      body.append(sidebar(stage));
      body.append(screen === 'home' ? homePage(act) : coursePage(stage, act));
      win.append(body);
    }
    if (screen === 'course+dialog') win.append(dialog(act));
    win.append(el('div', 'mdl-footer', m.footer));

    if (note) root.append(el('div', 'mdl-note ' + note.cls, note.text));
    return root;
  }

  function titleBar(guest) {
    const bar = el('div', 'mdl-bar');
    const burger = el('span', 'mdl-burger');
    burger.append(el('i'), el('i'), el('i'));
    const title = el('div', 'mdl-title');
    title.append(owlLogo(), el('span', '', m.titleBar.title));
    const right = el('div', 'mdl-right');
    right.append(globeIcon());
    if (guest) {
      const s = el('span', 'mdl-status');
      s.append('您正使用訪客身分瀏覽（', el('u', '', '登入'), '）');
      right.append(s);
    } else {
      right.append(el('span', 'mdl-status', '你（已登入）'));
    }
    bar.append(burger, title, right);
    return bar;
  }

  function sidebar(stage) {
    const side = el('nav', 'mdl-side');
    const openable = calendarOpenable(stage.id);
    for (const name of m.sidebar) {
      const isCal = name === '行事曆';
      const on = openable && ui.view === (isCal ? 'calendar' : 'home');
      side.append(btn(name, () => { if (!openable) return; ui.view = isCal ? 'calendar' : 'home'; refresh(); }, 'mdl-nav' + (on ? ' on' : '')));
    }
    return side;
  }

  function coursePage(stage, act) {
    const main = el('div', 'mdl-main');
    main.append(el('div', 'mdl-crumb', `首頁 / ${m.home.myCourses[1]} / 期中報告`));
    main.append(el('h1', '', m.assignment.title));
    const table = el('div', 'mdl-table');
    const row = (k, v) => { const r = el('div', 'mdl-row'); r.append(el('span', 'k', k), el('span', 'v', v)); table.append(r); };
    row('繳交狀態', m.assignment.statusDraft.replace('繳交狀態：', ''));
    row('截止時間', m.home.calendarEvent.replace('期中報告截止 ', '今天 '));
    row('繳交檔案', '最終版(1).docx');
    main.append(table);
    if (stage.id === 'final_submit') {
      const team = el('div', 'mdl-team');
      team.append(el('strong', '', '組員訊息'), el('p', '', stage.prompt));
      main.append(team);
      const acts = el('div', 'mdl-actions');
      acts.append(btn('把共用檔的結論併進來', () => act('merge'), 'mdl-sec'), btn('提交作業', () => act('submit'), 'mdl-primary'));
      main.append(acts);
    } else {
      main.append(btn('繳交', () => act('submit'), 'mdl-primary', stage.id !== 'submit'));
    }
    return main;
  }

  function homePage(act) {
    const main = el('div', 'mdl-main');
    if (ui.view === 'calendar') {
      main.append(el('h1', '', '行事曆'));
      const cal = el('div', 'mdl-cal');
      cal.append(el('div', 'mdl-cal-head', '今天'), btn(m.home.calendarEvent, () => act('calendar'), 'mdl-event'));
      main.append(cal);
      return main;
    }
    main.append(el('h1', '', '我的課程'));
    const list = el('div', 'mdl-courses');
    const ids = ['lastyear', 'thisyear', null];
    m.home.myCourses.forEach((name, i) => {
      const card = btn('', () => { if (ids[i]) act(ids[i]); }, 'mdl-course');
      card.append(el('span', 'mdl-thumb'), el('span', 'mdl-cname', name));
      if (i === 0) card.append(el('span', 'mdl-recent', '最近瀏覽'));
      list.append(card);
    });
    main.append(list);
    return main;
  }

  function dialog(act) {
    const shade = el('div', 'mdl-shade');
    const box = el('div', 'mdl-dialog');
    box.append(el('h2', '', m.guestDialog.title), el('p', '', m.guestDialog.text));
    const acts = el('div', 'mdl-actions');
    acts.append(btn(m.guestDialog.buttons[0], () => act('continue'), 'mdl-primary'), btn(m.guestDialog.buttons[1], () => act('cancel'), 'mdl-sec'));
    box.append(acts);
    shade.append(box);
    return shade;
  }

  function loginPage(stage, act) {
    const auto = loginMode(stage.id) === 'autofill';
    const L = m.loginPage.left;
    const R = m.loginPage.right;
    const page = el('div', 'mdl-login');
    const card = el('div', 'mdl-login-card');

    const left = el('div', 'mdl-login-left');
    left.append(owlLogo(), el('h2', '', L.title));
    for (const line of L.lines) left.append(el('p', '', line));
    left.append(btn(L.guestButton, () => act('guest'), 'mdl-ghost'));

    const right = el('div', 'mdl-login-right');
    right.append(el('h2', '', R.title));
    const user = el('input');
    const pass = el('input');
    user.type = 'text'; pass.type = 'password';
    user.placeholder = R.usernamePlaceholder; pass.placeholder = R.passwordPlaceholder;
    user.autocomplete = 'off'; pass.autocomplete = 'off';
    const remember = el('input');
    remember.type = 'checkbox';
    const submit = () => send(loginAction(pid, ui.pass, ui.remember));
    if (auto) {
      // 公用電腦記住了上一個人：欄位已填好，只能「直接登入」或「清掉」
      user.value = FAKE_ACCOUNT; pass.value = FAKE_PASSWORD_MASK;
      user.readOnly = pass.readOnly = true;
      remember.checked = true; remember.disabled = true;
    } else {
      user.value = ui.user; pass.value = ui.pass; remember.checked = ui.remember;
      user.addEventListener('input', () => { ui.user = user.value; });
      pass.addEventListener('input', () => { ui.pass = pass.value; });
      remember.addEventListener('change', () => { ui.remember = remember.checked; });
      pass.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      user.addEventListener('keydown', (e) => { if (e.key === 'Enter') pass.focus(); });
    }
    right.append(user, pass);
    const rem = el('label', 'mdl-remember');
    rem.append(remember, ` ${R.remember}`);
    right.append(rem, btn(R.loginButton, () => (auto ? act('autofill') : submit()), 'mdl-primary mdl-wide'));
    right.append(btn(R.forgot, () => act('forgot'), 'mdl-link'));
    if (auto) right.append(btn('清掉欄位，自己輸入', () => act('clear'), 'mdl-link'));

    card.append(left, right);
    page.append(card, btn('保持聯繫：寫信給管理者', () => act('contact'), 'mdl-link mdl-contact'));
    if (!auto) setTimeout(() => (ui.user ? pass : user).focus(), 0);
    return page;
  }

  return { render };
}

__exports.createMoodle = createMoodle;

});

__def("game/ui/puzzles/logic.js", function (__require, __exports) {
// 謎題介面的純邏輯（不碰 DOM，方便測試）：每種 stage type 的輸入狀態與送出的 value。

/** 這一步剛開始時的輸入狀態。 */
function initInput(stage) {
  switch (stage.type) {
    case 'code': return { text: '', checks: {} };
    case 'wheel': return { pos: stage.wheels.map(() => 0) };
    case 'sequence': return { picked: [] };
    case 'toggles': return { on: [] };
    case 'select': return { values: {} };
    default: return {};
  }
}

/** 滾輪 i 往前或往後轉一格（循環）。 */
function wheelStep(stage, input, i, dir) {
  const n = stage.wheels[i].length;
  input.pos[i] = (input.pos[i] + dir + n) % n;
}

function seqPush(input, id) { input.picked.push(id); }
function seqUndo(input) { input.picked.pop(); }
function seqClear(input) { input.picked.length = 0; }

function toggleSwitch(input, id) {
  const i = input.on.indexOf(id);
  if (i >= 0) input.on.splice(i, 1);
  else input.on.push(id);
}

function setField(input, fieldId, optionId) {
  if (optionId) input.values[fieldId] = optionId;
  else delete input.values[fieldId];
}

/** 能不能送出（code 要有字、sequence 要有按、select 每欄都選了）。 */
function canSubmit(stage, input) {
  switch (stage.type) {
    case 'code': return input.text.trim() !== '';
    case 'sequence': return input.picked.length > 0;
    case 'select': return stage.fields.every((f) => input.values[f.id]);
    default: return true;
  }
}

/** 轉成送給核心的 PUZZLE value。choice 不走這裡，直接送選項 id。 */
function toValue(stage, input) {
  switch (stage.type) {
    case 'code':
      return stage.checks?.length ? { answer: input.text.trim(), checks: { ...input.checks } } : input.text.trim();
    case 'wheel': return stage.wheels.map((w, i) => w[input.pos[i]]);
    case 'sequence': return [...input.picked];
    case 'toggles': return [...input.on];
    case 'select': return { ...input.values };
    default: return undefined;
  }
}

__exports.initInput = initInput;
__exports.wheelStep = wheelStep;
__exports.seqPush = seqPush;
__exports.seqUndo = seqUndo;
__exports.seqClear = seqClear;
__exports.toggleSwitch = toggleSwitch;
__exports.setField = setField;
__exports.canSubmit = canSubmit;
__exports.toValue = toValue;

});

__def("game/ui/puzzles/index.js", function (__require, __exports) {
// 6 種 stage type 的通用謎題介面（WP3），p7 的 Moodle 皮在 moodle.js（WP4）。
// 監聽 ui_open_puzzle 打開；送 PUZZLE 動作給核心，依 wrong／stage／solved／death 事件更新。
const { createMoodle } = __require("game/ui/puzzles/moodle.js");
const { initInput, wheelStep, seqPush, seqUndo, seqClear, toggleSwitch, setField, canSubmit, toValue } = __require("game/ui/puzzles/logic.js");

const CLOSE_ON = ['death', 'new_run', 'ending', 'finale'];

function initPuzzles(ctx, root) {
  const { game, content, bus, send } = ctx;

  // 樣式放在自己的資料夾，由這裡載入（不用動 index.html）
  const link = document.createElement('style');
  link.textContent = __CSS["game/ui/puzzles/puzzles.css"];
  document.head.append(link);
  const mlink = document.createElement('style');
  mlink.textContent = __CSS["game/ui/puzzles/moodle.css"];
  document.head.append(mlink);

  let pid = null;          // 目前打開的謎題
  let stageKey = '';       // 用來判斷步驟換了就重設輸入
  let input = null;
  let note = null;         // { text, cls }
  let done = false;        // 這關剛解完，顯示完成畫面
  let shake = false;
  let dirty = true;

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const button = (label, fn, cls = '', disabled = false) => {
    const b = el('button', cls, label);
    b.type = 'button';
    b.disabled = disabled;
    b.addEventListener('click', fn);
    return b;
  };
  const close = () => { pid = null; note = null; done = false; dirty = true; };

  bus.on('ui_open_puzzle', (ev) => {
    if (!game.puzzleAvailable(ev.puzzle)) return;
    pid = ev.puzzle; note = null; done = false; stageKey = ''; dirty = true;
  });
  bus.on('wrong', (ev) => { if (ev.puzzle === pid) { note = { text: ev.message || '不對。', cls: 'bad' }; shake = true; dirty = true; } });
  bus.on('stage_cleared', (ev) => { if (ev.puzzle === pid) { note = ev.message ? { text: ev.message, cls: 'ok' } : null; dirty = true; } });
  bus.on('message', (ev) => { if (pid) { note = { text: ev.text, cls: 'ok' }; dirty = true; } });
  bus.on('stage', (ev) => { if (ev.puzzle === pid) dirty = true; });
  bus.on('solved', (ev) => { if (ev.puzzle === pid) { done = true; dirty = true; } });
  // 一秒重來：死在謎題裡的話，按「再來一次」後直接把同一關打開在死掉的那一步（要在 close 之前記下來）
  let reopen = null;
  bus.on('death', (ev) => { reopen = pid && ev.death?.origin === pid ? pid : null; });
  bus.on('new_run', () => { reopen = null; });
  bus.on('retry', () => {
    const id = reopen;
    reopen = null;
    if (id && game.getState().phase === 'playing' && game.puzzleAvailable(id)) {
      pid = id; note = null; done = false; stageKey = ''; dirty = true;
    }
  });
  for (const t of CLOSE_ON) bus.on(t, close);
  bus.on('_flush', render);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pid) { close(); render(); } });

  const submit = () => {
    const stage = game.currentStage(pid);
    send({ type: 'PUZZLE', puzzle: pid, value: toValue(stage, input) });
  };

  // ---------- 各 stage type 的內容 ----------
  const bodies = {
    code(stage, body) {
      const inp = el('input', 'pz-code');
      inp.type = 'text';
      inp.value = input.text;
      inp.autocomplete = 'off';
      inp.placeholder = '輸入答案';
      inp.addEventListener('input', () => { input.text = inp.value; });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      body.append(inp);
      for (const c of stage.checks || []) {
        const label = el('label', 'pz-check');
        const cb = el('input');
        cb.type = 'checkbox';
        cb.checked = !!input.checks[c.id];
        cb.addEventListener('change', () => { input.checks[c.id] = cb.checked; });
        label.append(cb, ` ${c.label}`);
        body.append(label);
      }
      body.append(button('送出', submit, 'primary'));
      setTimeout(() => inp.focus(), 0);
    },
    wheel(stage, body) {
      const row = el('div', 'pz-wheels');
      stage.wheels.forEach((w, i) => {
        const col = el('div', 'pz-wheel');
        col.append(
          button('▲', () => { wheelStep(stage, input, i, -1); dirty = true; render(); }, 'pz-step'),
          el('div', 'pz-glyph', w[input.pos[i]]),
          button('▼', () => { wheelStep(stage, input, i, 1); dirty = true; render(); }, 'pz-step'),
        );
        row.append(col);
      });
      body.append(row, button('試試看', submit, 'primary'));
    },
    sequence(stage, body) {
      const labelOf = (id) => stage.buttons.find((b) => b.id === id)?.label ?? id;
      const grid = el('div', 'pz-grid');
      for (const b of stage.buttons) grid.append(button(b.label, () => { seqPush(input, b.id); dirty = true; render(); }));
      body.append(grid);
      body.append(el('div', 'pz-picked', input.picked.length ? `已按：${input.picked.map(labelOf).join(' → ')}` : '還沒按任何一顆'));
      const row = el('div', 'pz-row');
      row.append(
        button('退一步', () => { seqUndo(input); dirty = true; render(); }, '', !input.picked.length),
        button('清除', () => { seqClear(input); dirty = true; render(); }, '', !input.picked.length),
        button('送出', submit, 'primary', !canSubmit(stage, input)),
      );
      body.append(row);
    },
    toggles(stage, body) {
      const row = el('div', 'pz-switches');
      for (const id of stage.switches) {
        const on = input.on.includes(id);
        row.append(button(`${id}　${on ? '開' : '關'}`, () => { toggleSwitch(input, id); dirty = true; render(); }, 'pz-switch' + (on ? ' on' : '')));
      }
      body.append(row, button('確認', submit, 'primary'));
    },
    select(stage, body) {
      for (const f of stage.fields) {
        const label = el('label', 'pz-field', `${f.label}　`);
        const sel = el('select');
        sel.append(new Option('請選擇', ''));
        for (const o of f.options) sel.append(new Option(o.label, o.id));
        sel.value = input.values[f.id] || '';
        sel.addEventListener('change', () => { setField(input, f.id, sel.value); dirty = true; render(); });
        label.append(sel);
        body.append(label);
      }
      body.append(button('送出', submit, 'primary', !canSubmit(stage, input)));
    },
    choice(stage, body) {
      const list = el('div', 'pz-options');
      for (const o of stage.options) {
        const b = button(o.label, () => send({ type: 'PUZZLE', puzzle: pid, value: o.id }), 'pz-option');
        if (o.desc) b.append(el('span', 'pz-desc', o.desc));
        list.append(b);
      }
      body.append(list);
    },
  };

  const moodle = createMoodle({ content, send, pid: 'p7', close: () => { close(); render(); }, refresh: () => { dirty = true; render(); } });

  function render() {
    if (!dirty) return;
    dirty = false;
    root.innerHTML = '';
    if (!pid) return;
    if (pid === 'p7' && !done) {   // p7 換成假 Moodle 皮
      const overlay = el('div', 'pz-overlay');
      overlay.append(moodle.render(game.currentStage(pid), note, shake));
      shake = false;
      root.append(overlay);
      return;
    }
    const p = content.puzzleById[pid];
    const card = el('div', 'pz-card' + (shake ? ' shake' : ''));
    shake = false;
    const head = el('div', 'pz-head');
    head.append(el('strong', '', p.title), button('✕', () => { close(); render(); }, 'pz-close'));
    card.append(head);

    if (done) {
      card.append(el('p', 'pz-prompt', '這關解開了。'));
      if (note) card.append(el('div', 'pz-note ' + note.cls, note.text));
      card.append(button('好', () => { close(); render(); }, 'primary'));
    } else {
      const stage = game.currentStage(pid);
      const idx = p.stages.findIndex((s) => s.id === stage.id);
      const key = `${pid}:${stage.id}`;
      if (key !== stageKey) { stageKey = key; input = initInput(stage); }
      head.append(el('span', 'pz-step-no', `第 ${idx + 1} / ${p.stages.length} 步`));
      card.append(el('p', 'pz-prompt', stage.prompt));
      const body = el('div', 'pz-body pzt-' + stage.type);
      (bodies[stage.type] || bodies.choice)(stage, body);
      card.append(body);
      if (note) card.append(el('div', 'pz-note ' + note.cls, note.text));
    }
    const overlay = el('div', 'pz-overlay');
    overlay.append(card);
    root.append(overlay);
  }
}

__exports.initPuzzles = initPuzzles;

});

__def("game/ui/screens/logic.js", function (__require, __exports) {
// 畫面用的純函式（不碰 DOM），方便測試。

/** 字串轉成 32 位元雜湊，當作佔位美術的種子。 */
function hash(str) {
  let h = 2166136261;
  for (const ch of String(str)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 小型亂數產生器，同一個種子永遠同一串。 */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/** 16×16 左右對稱的像素圖樣，值 0 = 底、1 = 前景、2 = 亮點。 */
function artGrid(key, size = 16) {
  const r = rng(hash(key));
  const half = size / 2;
  const grid = [];
  for (let y = 0; y < size; y++) {
    const row = new Array(size).fill(0);
    for (let x = 0; x < half; x++) {
      // 中間密、邊緣疏，看起來像個小東西
      const edge = Math.abs(x - half) / half;
      const v = r() < 0.62 - edge * 0.15 && y > 1 && y < size - 2 ? (r() < 0.2 ? 2 : 1) : 0;
      row[x] = v;
      row[size - 1 - x] = v;
    }
    grid.push(row);
  }
  return grid;
}

/** 沒有素材時，用 key 算一個固定的色相。 */
function placeholderColor(key, light = 45) {
  return `hsl(${hash(key) % 360} 45% ${light}%)`;
}

const pad2 = (n) => String(n).padStart(2, '0');

/** 圖鑑格子：把 codex() 的項目補上美術 key、提示與動作說明。 */
function codexCells(codex, content) {
  const roomName = (id) => content.rooms.byId[id]?.name ?? id;
  return codex.entries.map((e) => {
    if (e.kind === 'death') {
      const d = content.deathById[e.id];
      const p = content.puzzleById[d.origin];
      const where = p ? `第 ${p.order} 關「${p.title}」` : `${roomName(d.origin)}`;
      return { ...e, no: e.no, art: d.art, action: d.action, tip: d.tip, hint: `出沒地點：${where}` };
    }
    const en = content.endingById[e.id];
    return { ...e, art: en.art, action: '', tip: '', hint: '尚未走到的結局' };
  });
}

/** 收集率百分比（整數）。 */
function percent(found, total) {
  return total ? Math.round((found / total) * 100) : 0;
}

/**
 * 死因卡資料。events 的 death 事件有 corner／senpai；重新整理後從存檔回推。
 * @param {{death, isNew, clock, corner, senpai}} ev
 */
function deathCardData(ev, codex) {
  const no = ev.death.no;
  return {
    death: ev.death,
    isNew: !!ev.isNew,
    no,
    noText: pad2(no),
    found: codex.found,
    total: codex.total,
    clock: ev.clock,
    corner: ev.corner,
    senpai: ev.senpai || null,
  };
}

/** 從存檔狀態回推死因卡的事件（重新整理頁面時用）。 */
function deathEventFromState(state, content, clockText) {
  const d = content.deathById[state.lastDeath];
  if (!d) return null;
  const corners = content.texts.deathCardCorner;
  const ev = { type: 'death', death: d, isNew: false, clock: clockText, corner: corners[Math.max(0, state.deaths - 1) % corners.length] };
  const n = state.puzzles[d.origin]?.deaths ?? 0;
  const every = content.hints.senpaiAfterDeaths;
  if (n > 0 && n % every === 0) ev.senpai = `${content.hints.puzzles[d.origin].senpai}${content.hints.senpaiSignature}`;
  return ev;
}

/** 結算畫面各列。 */
function resultRows(results, endingId) {
  const timeLabel = endingId === 'end_dawn' ? '結束時間' : '通關時間';
  return [
    { label: timeLabel, value: results.clock },
    { label: '死亡次數', value: `${results.deaths} 次` },
    { label: '圖鑑收集率', value: `${results.codexFound} / ${results.codexTotal}（${percent(results.codexFound, results.codexTotal)}%）` },
  ];
}

/** 開局時還沒碰過任何東西（沒有進度可以繼續）。 */
function isFreshState(state, startClock) {
  return state.phase === 'playing' && state.clock === startClock && state.deaths === 0 && !state.doorLocked &&
    state.items.length === 0 && Object.values(state.puzzles).every((p) => !p.solved && p.stage === 0);
}

__exports.hash = hash;
__exports.rng = rng;
__exports.artGrid = artGrid;
__exports.placeholderColor = placeholderColor;
__exports.codexCells = codexCells;
__exports.percent = percent;
__exports.deathCardData = deathCardData;
__exports.deathEventFromState = deathEventFromState;
__exports.resultRows = resultRows;
__exports.isFreshState = isFreshState;
__exports.pad2 = pad2;

});

__def("game/ui/screens/art.js", function (__require, __exports) {
// 佔位美術：沒有素材時用程式畫的像素色塊，有 src 就載圖，載入失敗退回色塊。
const { getAsset, whenImage } = __require("game/ui/assets.js");
const { artGrid, placeholderColor } = __require("game/ui/screens/logic.js");

const SIZE = 16;

function paintPlaceholder(ctx, key, asset, silhouette) {
  const base = silhouette ? '#10131a' : asset.color && asset.color !== '#888' ? asset.color : placeholderColor(key, 38);
  const fg = silhouette ? '#252b3a' : placeholderColor(key, 68);
  const hi = silhouette ? '#2f3648' : '#fff6d6';
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, SIZE, SIZE);
  artGrid(key, SIZE).forEach((row, y) => row.forEach((v, x) => {
    if (!v) return;
    ctx.fillStyle = v === 2 ? hi : fg;
    ctx.fillRect(x, y, 1, 1);
  }));
}

/** 回傳一個 canvas（16×16，放大顯示時不糊）。silhouette 為真時畫剪影。 */
function makeArt(key, { silhouette = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  canvas.className = 'sc-art' + (silhouette ? ' sil' : '');
  const ctx = canvas.getContext('2d');
  const asset = getAsset(key);
  paintPlaceholder(ctx, key, asset, silhouette);
  if (asset.src && !silhouette) {
    // 載入失敗（img 為 null）就保留色塊
    whenImage(key, (img) => { if (img) { ctx.clearRect(0, 0, SIZE, SIZE); ctx.imageSmoothingEnabled = false; ctx.drawImage(img, 0, 0, SIZE, SIZE); } });
  }
  return canvas;
}

__exports.makeArt = makeArt;

});

__def("game/ui/screens/index.js", function (__require, __exports) {
// 開場、死因卡、圖鑑、結局、結算畫面（WP5）。
// 監聽 new_run / death / retry / finale / ending 事件；只讀狀態、只送動作。
// 任何畫面顯示期間：蓋住全畫面、擋掉鍵盤，玩家不能做別的事。
const { makeArt } = __require("game/ui/screens/art.js");
const { typeDuration, TYPE_MS } = __require("game/ui/flavor-logic.js");
const { codexCells, deathCardData, deathEventFromState, resultRows, isFreshState, pad2 } = __require("game/ui/screens/logic.js");

const DEBUG_KEYS = ['jump', 'death', 'ending', 'unlock', 'clock'];

function initScreens(ctx, root) {
  const { game, content, bus, send, params } = ctx;

  const link = document.createElement('style');
  link.textContent = __CSS["game/ui/screens/screens.css"];
  document.head.append(link);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const button = (label, fn, cls = '') => {
    const b = el('button', cls, label);
    b.type = 'button';
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    return b;
  };

  // ---------- 畫面管理 ----------
  let current = null;          // { name, node, onKey?, onClose? }
  let menu = null;
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };

  function clear() {
    for (const t of timers) clearTimeout(t);
    timers.clear();
    if (current?.node) current.node.remove();
    current = null;
  }
  function show(name, node, extra = {}) {
    clear();
    current = { name, node, ...extra };
    root.append(node);
    drawMenu();
    node.querySelector('.primary')?.focus({ preventScroll: true });
  }
  function close() {
    clear();
    drawMenu();
  }

  // 顯示期間擋掉其他鍵盤輸入（謎題介面的 Esc 之類），只放行該畫面自己要的鍵
  window.addEventListener('keydown', (e) => {
    if (!current) return;
    const onButton = e.target instanceof HTMLButtonElement;
    if (current.onKey?.(e)) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (!(onButton && (e.key === 'Enter' || e.key === ' '))) e.stopImmediatePropagation();
  }, true);

  // ---------- 右上角選單（圖鑑、重新開始） ----------
  function drawMenu() {
    menu?.remove();
    menu = null;
    if (current) return;
    menu = el('div', 'sc-menu');
    const cx = game.codex();
    menu.append(button(`圖鑑 ${cx.found}/${cx.total}`, openCodex));
    let armed = false;
    const restart = button('重新開始', () => {
      if (!armed) { armed = true; restart.textContent = '再按一次確認'; later(() => { armed = false; restart.textContent = '重新開始'; }, 3000); return; }
      send({ type: 'NEW_RUN' });
    });
    menu.append(restart);
    root.append(menu);
  }
  bus.on('_flush', () => { if (!current) drawMenu(); });

  // ---------- 標題 ----------
  function showTitle() {
    const node = el('div', 'sc-overlay');
    const box = el('div', 'sc-title sc-fade');
    box.append(el('h1', '', '天亮前交出去'), el('p', '', '期中週前一晚，你被鎖在系館裡。'));
    const row = el('div', 'row');
    row.append(button('開始', () => send({ type: 'NEW_RUN' }), 'primary'), button('圖鑑', openCodex));
    box.append(row);
    node.append(box);
    show('title', node);
  }

  // ---------- 開場字幕 ----------
  function showOpening(ev) {
    const lines = ev.opening || [];
    const node = el('div', 'sc-overlay sc-opening');
    let i = -1;
    let timer = null;
    const line = el('div', 'line');
    const hint = el('div', 'hint', '點一下繼續');
    const skip = button('跳過', () => toNote());
    skip.className = 'skip';
    node.append(line, hint, skip);

    function toNote() {
      if (current?.node !== node) return;
      clearTimeout(timer);
      const wrap = el('div', 'sc-note-wrap sc-fade');
      const note = el('div', 'sc-note');
      note.append(el('div', '', ev.tutorialNote), el('small', '', '（學長留的便利貼）'));
      wrap.append(note, button('知道了', close, 'primary'));
      node.className = 'sc-overlay';
      node.replaceChildren(wrap);
      wrap.querySelector('.primary').focus();
      current.onKey = null;
    }
    function next() {
      clearTimeout(timer);
      i += 1;
      if (i >= lines.length) return toNote();
      line.textContent = lines[i];
      line.className = 'line' + (lines[i].includes('我都可以') ? ' hot' : '');
      line.style.animation = 'none';
      void line.offsetWidth;
      line.style.animation = '';
      timer = later(next, 2800);
    }
    // 先演一段群組聊天（阿哲刪了報告），點一下或播完再上字幕
    const chat = content.texts.openingChat;
    let chatting = !!chat?.messages?.length;
    function startCaptions() {
      if (!chatting) return;
      chatting = false;
      clearTimeout(timer);
      node.replaceChildren(line, hint, skip);
      next();
    }
    function playChat() {
      const phone = el('div', 'sc-phone');
      const head = el('div', 'sc-phone-head', chat.title);
      const list = el('div', 'sc-phone-list');
      phone.append(el('div', 'sc-phone-time', '00:47'), head, list);
      node.replaceChildren(phone, hint, skip);
      let k = 0;
      const push = () => {
        if (!chatting || current?.node !== node) return;
        const m = chat.messages[k];
        if (!m) { hint.textContent = '點一下繼續'; return; }
        const row = el('div', 'sc-msg' + (m.me ? ' me' : '') + (m.sys ? ' sys' : ''));
        if (!m.me && !m.sys) row.append(el('div', 'from', m.from));
        if (m.note) row.append(el('div', 'note', m.note));
        row.append(el('div', 'bubble', m.text));
        list.append(row);
        list.scrollTop = list.scrollHeight;
        ctx.sfx?.(m.me ? 'interact' : 'buzz');
        k += 1;
        timer = later(push, m.me ? 900 : 1100);
      };
      hint.textContent = '點一下跳過聊天';
      timer = later(push, 500);
    }
    node.addEventListener('click', () => {
      if (chatting) return startCaptions();
      if (i >= 0 && i < lines.length) next();
    });
    show('opening', node, { onKey: (e) => { if (e.key === 'Enter' || e.key === ' ') { if (chatting) startCaptions(); else next(); return true; } return false; } });
    if (chatting) playChat();
    else next();
  }

  // ---------- 死因卡 ----------
  function showDeath(ev) {
    const data = deathCardData(ev, game.codex());
    const d = data.death;
    const node = el('div', 'sc-overlay sc-death');
    const card = el('div', 'sc-card sc-fade');
    if (data.isNew) card.append(el('div', 'sc-stamp', 'NEW'));

    const no = el('div', 'no');
    no.append(el('span', '', `圖鑑 No.${data.noText} / ${data.total}`), el('span', '', `已收集 ${data.found}`));
    const artBox = el('div', 'art-box');
    artBox.append(makeArt(d.art));
    const big = el('div', 'big', '');
    card.append(no, artBox, el('div', 'ttl', d.title), big);
    const chars = [...d.text];
    let typed = 0;
    const typeTick = () => {
      typed += 1;
      big.textContent = chars.slice(0, typed).join('');
      if (typed < chars.length) later(typeTick, TYPE_MS);
    };
    node.append(el('div', 'sc-flash'));
    if (d.tip) card.append(el('div', 'tip', `下次試試：${d.tip}`));
    if (data.corner) card.append(el('div', 'corner', data.corner));
    const cost = el('div', 'cost');
    cost.append(el('span', '', content.texts.deathTimeCost), el('span', '', `現在 ${data.clock}`));
    if (data.senpai) card.append(el('div', 'sc-senpai', data.senpai));
    card.append(cost, el('div', 'retry', `${content.texts.deathCardRetry}（點一下）`));
    node.append(card);

    // 剛出現的半秒內不吃點擊，避免連點直接跳過
    const bornAt = performance.now();
    let used = false;
    const retry = () => {
      if (used) return;
      if (typed < chars.length) { typed = chars.length - 1; return; } // 還在打字：先把字打完
      if (performance.now() - bornAt < 450) return;
      used = true;
      send({ type: 'RETRY' }); // 天亮的話這裡會直接換成結局畫面
      if (current?.node === node) {
        card.classList.add('sc-leaving');
        later(() => { if (current?.node === node) close(); }, 500);
      }
    };
    node.addEventListener('click', retry);
    show('death', node, { onKey: (e) => { if (e.key === 'Enter' || e.key === ' ') { retry(); return true; } return false; } });
    later(typeTick, 380); // 要在 show() 之後排，show() 會清掉之前排的計時器
  }

  // ---------- 圖鑑 ----------
  function openCodex() {
    const prev = current && current.name === 'title' ? 'title' : null;
    const cells = codexCells(game.codex(), content);
    const found = cells.filter((c) => c.found).length;
    const node = el('div', 'sc-overlay sc-codex');
    const box = el('div', 'sc-codex-box');
    const head = el('div', 'sc-codex-head');
    head.append(el('h2', '', `圖鑑　${found} / ${cells.length}`), button('關閉', () => (prev ? showTitle() : close()), 'primary'));
    const grid = el('div', 'sc-grid');
    const detail = el('div', 'sc-detail', '點一格看詳細。');
    let selBtn = null;
    for (const c of cells) {
      const b = el('button', 'sc-cell ' + (c.found ? 'on' : 'off'));
      b.type = 'button';
      b.append(el('span', 'n', `No.${pad2(c.no)}${c.kind === 'ending' ? '　結局' : ''}`), makeArt(c.art, { silhouette: !c.found }));
      b.append(el('span', 't' + (c.kind === 'ending' && c.found ? ' end' : ''), c.found ? c.title : '？？？'));
      b.addEventListener('click', () => {
        selBtn?.classList.remove('sel');
        selBtn = b;
        b.classList.add('sel');
        detail.replaceChildren();
        if (c.found) {
          const lines = [`No.${pad2(c.no)}　${c.title}`];
          if (c.kind === 'death') lines.push(`你做了：${c.action}`, c.text, c.tip ? `下次試試：${c.tip}` : '');
          else lines.push(c.text);
          detail.textContent = lines.filter(Boolean).join('\n');
        } else {
          detail.textContent = `No.${pad2(c.no)}　還沒解鎖\n${c.hint}`;
        }
      });
      grid.append(b);
    }
    box.append(head, grid, detail);
    node.append(box);
    show('codex', node, { onKey: (e) => { if (e.key === 'Escape') { prev ? showTitle() : close(); return true; } return false; } });
  }

  // ---------- 結局前的兩顆按鈕 ----------
  function showFinale(text) {
    const f = content.texts.finale;
    const node = el('div', 'sc-overlay sc-finale');
    const row = el('div', 'row');
    row.append(button(f.home, () => send({ type: 'FINALE', choice: 'home' }), 'primary'), button(f.unread, () => send({ type: 'FINALE', choice: 'unread' })));
    // 核心的 finale 事件 text 實際是整包 texts.finale 物件，這裡兩種都吃
    node.append(el('p', 'sc-fade', (typeof text === 'string' ? text : text?.prompt) || f.prompt), row);
    finaleNote = el('p', 'sc-finale-locked');
    finaleNote.style.whiteSpace = 'pre-line';
    node.append(finaleNote);
    show('finale', node);
  }
  let finaleNote = null;
  // 圖鑑還沒到門檻時點未讀：核心不給結局，只回 finale_locked，顯示那句梗與還差幾格
  function showFinaleLocked(ev) {
    if (finaleNote) finaleNote.textContent = `${ev.text}\n${ev.hint}`;
  }

  // ---------- 結局 ----------
  function showEnding(ev) {
    const en = ev.ending;
    const node = el('div', 'sc-overlay sc-ending');
    const wrap = el('div', 'art-wrap');
    if (ev.isNew) wrap.append(el('div', 'sc-stamp', 'NEW'));
    wrap.append(makeArt(en.art));
    const lines = el('div', 'lines');
    en.lines.forEach((t, i) => {
      const p = el('p', '', t);
      p.style.animationDelay = `${0.4 + i * 1.1}s`;
      lines.append(p);
    });
    const after = el('div', 'later');
    after.style.animationDelay = `${0.4 + en.lines.length * 1.1}s`;
    after.append(button('看結算', () => showResults(ev), 'primary'));
    node.append(el('div', 'no', `結局　圖鑑 No.${pad2(en.no)}`), wrap, el('h2', '', en.title), lines, after);
    show('ending', node);
  }

  // ---------- 結算 ----------
  function showResults(ev) {
    const r = ev.results;
    const node = el('div', 'sc-overlay');
    const box = el('div', 'sc-results sc-fade');
    box.append(el('h2', '', '結算'));
    for (const row of resultRows(r, ev.ending.id)) {
      const line = el('div', 'row');
      line.append(el('span', '', row.label), el('b', '', row.value));
      box.append(line);
    }
    for (const t of r.lines) box.append(el('p', 'joke', t));
    const btns = el('div', 'btns');
    btns.append(button('再玩一次', () => send({ type: 'NEW_RUN' }), 'primary'), button('看圖鑑', openCodex));
    box.append(btns);
    node.append(box);
    show('results', node);
  }

  // ---------- 過場（警衛鎖門） ----------
  // 第一次碰筆電時核心會發 cutscene；蓋在謎題上面，按一下回到謎題
  function showCutscene(ev) {
    if (current && current.name !== 'title') return; // 別蓋掉死因卡或結局
    const node = el('div', 'sc-overlay sc-finale');
    for (const t of ev.lines || []) node.append(el('p', 'sc-fade', t));
    const row = el('div', 'row');
    row.append(button('繼續', close, 'primary'));
    node.append(row);
    show('cutscene', node, { onKey: (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { close(); return true; } return false; } });
  }

  // ---------- 事件 ----------
  bus.on('cutscene', showCutscene);
  // 除錯跳關會換掉整局狀態，蓋著的結局／死因卡要收掉，不然會擋住畫面
  bus.on('debug', (ev) => { if (ev.did === 'jump' && current) close(); });
  bus.on('new_run', showOpening);
  bus.on('death', showDeath);
  bus.on('finale', (ev) => showFinale(ev.text));
  bus.on('finale_locked', showFinaleLocked);
  bus.on('ending', showEnding);

  // ---------- 重新整理後接回目前階段 ----------
  const st = game.getState();
  const hasDebugAction = ctx.debug && DEBUG_KEYS.some((k) => params.get(k));
  if (st.phase === 'dead') {
    const ev = deathEventFromState(st, content, game.clockText());
    if (ev) showDeath(ev);
  } else if (st.phase === 'finale') {
    showFinale();
  } else if (st.phase === 'ending' && content.endingById[st.ending]) {
    const ev = { ending: content.endingById[st.ending], isNew: false, results: game.results() };
    showEnding(ev);
  } else if (!hasDebugAction && isFreshState(st, content.texts.clock.start)) {
    showTitle();
  } else {
    drawMenu();
  }
}

__exports.initScreens = initScreens;

});

__def("game/ui/hud/logic.js", function (__require, __exports) {
// HUD 的純邏輯：小地圖顯示哪些房間、任務文字、額度文字、卡關計時。不碰 DOM。

/** 小地圖格位：4 欄 3 列，走廊橫跨整列，大致照實際地圖的上下位置排。 */
const MINIMAP_LAYOUT = {
  r401: { col: 0, row: 0, span: 1 },
  pantry: { col: 1, row: 0, span: 1 },
  r503: { col: 2, row: 0, span: 1 },
  office: { col: 3, row: 0, span: 1 },
  hall: { col: 0, row: 1, span: 4 },
  lab: { col: 0, row: 2, span: 1 },
  floor1: { col: 3, row: 2, span: 1 },
};
const MINIMAP_COLS = 4;
const MINIMAP_ROWS = 3;

/** 去過的房間 id 集合（目前所在一定算）。 */
function addVisited(visited, roomId) {
  const set = new Set(visited || []);
  if (roomId) set.add(roomId);
  return set;
}

/** 小地圖要畫的房間：只有去過的；標出目前所在與目標房間（目標房間沒去過也要標，才知道往哪走，但只畫小問號格）。 */
function minimapCells({ visited, current, target, layout = MINIMAP_LAYOUT, names = {} }) {
  const seen = addVisited(visited, current);
  const cells = [];
  for (const [id, pos] of Object.entries(layout)) {
    const isSeen = seen.has(id);
    const isTarget = id === target;
    if (!isSeen && !isTarget) continue;
    cells.push({ id, ...pos, name: isSeen ? (names[id] ?? id) : '？', seen: isSeen, here: id === current, target: isTarget });
  }
  return cells;
}

/** 任務欄文字：永遠有一句。puzzle 是 game.currentPuzzle()，other 是同時開放的另一關（p7／p8）。 */
function taskText({ puzzle, other, roomName, otherRoomName, phase }) {
  if (phase === 'ending') return '今晚結束了。';
  if (phase === 'finale') return '報告交了。回家，還是點開那則未讀？';
  if (!puzzle) return '出口就在眼前，走出去吧。';
  let text = `${roomName ? `${roomName}：` : ''}${puzzle.title}`;
  if (puzzle.optional) text += '（可跳過）';
  if (other) text += `　或直接去${otherRoomName ? ` ${otherRoomName}：` : ' '}${other.title}`;
  return text;
}

/** 找出「下一個目標」和同時開放的另一關。 */
function pickTargets(game, content) {
  const puzzle = game.currentPuzzle();
  if (!puzzle) return { puzzle: null, other: null };
  const other = content.puzzles.find((p) => p.id !== puzzle.id && game.puzzleAvailable(p.id) && !p.optional && puzzle.optional) || null;
  return { puzzle, other };
}

/** AI 額度文字。 */
function quotaText(left, total) {
  return left > 0 ? `剩 ${left}／${total} 次` : '額度用完';
}

/** 卡關計時：同一題連續停留超過 idleMs 就觸發一次；換題或 reset 後重新計。 */
function createIdleTracker(idleMs) {
  let key = null;
  let since = 0;
  let fired = false;
  return {
    /** 重新開始計時（換題、死亡重來、新局）。key 為 null 代表現在不用計。 */
    reset(newKey, now) { key = newKey; since = now; fired = false; },
    /** 換題才重置，同題不動。 */
    track(newKey, now) { if (newKey !== key) this.reset(newKey, now); },
    /** 該不該自言自語；回傳題目 id 或 null。每個 reset 後最多一次。 */
    check(now) {
      if (key == null || fired || now - since < idleMs) return null;
      fired = true;
      return key;
    },
    get key() { return key; },
  };
}

/** 時鐘跳了多少分鐘（用 HH:MM 字串算），沒變回 0。 */
function clockDelta(prev, next) {
  const toMin = (s) => { const [h, m] = String(s).split(':').map(Number); return h * 60 + m; };
  if (!prev || !next || prev === next) return 0;
  return toMin(next) - toMin(prev);
}

__exports.addVisited = addVisited;
__exports.minimapCells = minimapCells;
__exports.taskText = taskText;
__exports.pickTargets = pickTargets;
__exports.quotaText = quotaText;
__exports.createIdleTracker = createIdleTracker;
__exports.clockDelta = clockDelta;
__exports.MINIMAP_LAYOUT = MINIMAP_LAYOUT;
__exports.MINIMAP_COLS = MINIMAP_COLS;
__exports.MINIMAP_ROWS = MINIMAP_ROWS;

});

__def("game/ui/hud/index.js", function (__require, __exports) {
// HUD：時鐘、任務欄、小地圖、AI 助教、手機未讀、60 秒自言自語（WP6）。
// 只讀狀態、只送動作。美術全部用 CSS 與 Canvas 程式畫，沒有外部圖與字型。
const { MINIMAP_COLS, MINIMAP_ROWS, minimapCells, addVisited, taskText, pickTargets, quotaText, createIdleTracker, clockDelta } = __require("game/ui/hud/logic.js");

const VISITED_KEY = 'latia-mid:visited:v1';
const readVisited = () => { try { return JSON.parse(localStorage.getItem(VISITED_KEY)) || []; } catch { return []; } };
const writeVisited = (arr) => { try { localStorage.setItem(VISITED_KEY, JSON.stringify(arr)); } catch { /* 拿不到就只留在記憶體 */ } };

// 像素圖示：每個字元一格，'.' 是透明
const ICONS = {
  phone: ['.######.', '#......#', '#.####.#', '#.####.#', '#.####.#', '#.####.#', '#......#', '#..##..#', '.######.'],
  robot: ['...##...', '..####..', '.######.', '##.##.##', '########', '########', '.#.##.#.', '.#....#.'],
};
function drawIcon(canvas, name, color, px = 3) {
  const rows = ICONS[name];
  canvas.width = rows[0].length * px;
  canvas.height = rows.length * px;
  const g = canvas.getContext('2d');
  g.fillStyle = color;
  rows.forEach((row, y) => [...row].forEach((c, x) => { if (c === '#') g.fillRect(x * px, y * px, px, px); }));
}

const SHORT = { r401: '401', hall: '走廊', pantry: '茶水', r503: '503', office: '系辦', lab: '電腦', floor1: '一樓' };

function initHud(ctx, root) {
  const { game, content, bus, send } = ctx;
  const texts = content.texts;
  const hints = content.hints;

  const link = document.createElement('style');
  link.textContent = __CSS["game/ui/hud/hud.css"];
  document.head.append(link);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const roomNames = Object.fromEntries(content.rooms.list.map((r) => [r.id, r.name.split('（')[0]]));

  // ---------- 版面 ----------
  const bar = el('div', 'hd');
  const clock = el('div', 'hd-clock');
  const clockTime = el('span', 'hd-clock-time', '--:--');
  const clockPlus = el('span', 'hd-clock-plus');
  clock.append(el('span', 'hd-clock-label', '現在'), clockTime, clockPlus);

  const task = el('div', 'hd-task');
  const taskBody = el('span', 'hd-task-body');
  task.append(el('span', 'hd-task-tag', '目標'), taskBody);

  const mapCanvas = el('canvas', 'hd-map-canvas');

  const aiBtn = el('button', 'hd-ai');
  aiBtn.type = 'button';
  const aiIcon = el('canvas', 'hd-icon');
  drawIcon(aiIcon, 'robot', '#7fe3ff');
  const aiQuota = el('span', 'hd-ai-quota');
  aiBtn.append(aiIcon, el('span', 'hd-ai-label', 'AI 助教'), aiQuota);

  const phoneBtn = el('button', 'hd-phone');
  phoneBtn.type = 'button';
  const phoneIcon = el('canvas', 'hd-icon');
  drawIcon(phoneIcon, 'phone', '#f4f1de');
  phoneBtn.title = texts.phoneBadge;
  phoneBtn.append(phoneIcon, el('span', 'hd-phone-badge', '1'), el('span', 'hd-phone-text', texts.phoneBadge));

  const bubble = el('div', 'hd-bubble');
  bubble.hidden = true;
  const bubbleWho = el('div', 'hd-bubble-who');
  const bubbleText = el('div', 'hd-bubble-text');
  const bubbleMeta = el('div', 'hd-bubble-meta');
  bubble.append(bubbleWho, bubbleText, bubbleMeta);

  const left = el('div', 'hd-left');
  left.append(clock, mapCanvas);
  const mid = el('div', 'hd-mid');
  mid.append(task);
  const right = el('div', 'hd-right');
  right.append(aiBtn, phoneBtn);
  bar.append(left, mid, right);
  root.append(bar, bubble);

  // HUD 疊在謎題浮層上面（解題時也能問助教），浮層要往下讓開：把 HUD 底部位置交給 CSS 的 --hud-h
  const syncHudH = () => document.documentElement.style.setProperty('--hud-h', `${Math.max(0, Math.ceil(bar.getBoundingClientRect().bottom))}px`);
  syncHudH();
  window.addEventListener('resize', syncHudH);
  window.addEventListener('scroll', syncHudH, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(syncHudH).observe(bar);

  // ---------- 去過的房間 ----------
  let visited = new Set(readVisited());
  const markVisited = (id) => {
    if (!id || visited.has(id)) return;
    visited = addVisited(visited, id);
    writeVisited([...visited]);
  };

  // ---------- 小地圖 ----------
  const CELL = 18, GAP = 3, PAD = 3, ZOOM = 2; // 畫布就是顯示尺寸（不靠 CSS 縮放），文字才不會糊
  const MAP_W = PAD * 2 + MINIMAP_COLS * CELL + (MINIMAP_COLS - 1) * GAP;
  const MAP_H = PAD * 2 + MINIMAP_ROWS * CELL + (MINIMAP_ROWS - 1) * GAP;
  mapCanvas.width = MAP_W * ZOOM;
  mapCanvas.height = MAP_H * ZOOM;
  const mg = mapCanvas.getContext('2d');
  function drawMap(current, target) {
    mg.setTransform(ZOOM, 0, 0, ZOOM, 0, 0);
    mg.imageSmoothingEnabled = false;
    mg.fillStyle = '#0b0d12';
    mg.fillRect(0, 0, MAP_W, MAP_H);
    mg.strokeStyle = '#343a4a';
    mg.lineWidth = 1;
    mg.strokeRect(0.5, 0.5, MAP_W - 1, MAP_H - 1);
    const blink = Math.floor(performance.now() / 400) & 1;
    for (const c of minimapCells({ visited, current, target, names: roomNames })) {
      const x = PAD + c.col * (CELL + GAP);
      const y = PAD + c.row * (CELL + GAP);
      const w = c.span * CELL + (c.span - 1) * GAP;
      mg.fillStyle = c.seen ? (c.id === 'hall' ? '#3a4054' : '#4b5470') : '#1c2030';
      mg.fillRect(x, y, w, CELL);
      mg.fillStyle = c.seen ? '#2b3040' : '#12141c';
      mg.fillRect(x, y + CELL - 3, w, 3);
      if (c.target) {
        mg.strokeStyle = blink ? '#ffe27a' : '#f0b429';
        mg.lineWidth = 2;
        mg.strokeRect(x + 1, y + 1, w - 2, CELL - 2);
      }
      mg.fillStyle = c.seen ? '#dfe3f0' : '#6a7088';
      mg.font = '6px "Pixel Font", "Microsoft JhengHei", sans-serif'; // 乘上 ZOOM 是 12px，字型原生大小
      mg.textAlign = 'center';
      mg.textBaseline = 'middle';
      mg.fillText(c.seen ? (SHORT[c.id] ?? c.name.slice(0, 2)) : '？', x + w / 2, y + CELL / 2 - 1);
      if (c.here) {
        mg.fillStyle = '#e56b6f';                       // 目前所在：左上角紅點
        mg.fillRect(x + 1, y + 1, 4, 4);
        mg.fillStyle = '#fff';
        mg.fillRect(x + 2, y + 2, 1, 1);
      }
    }
  }

  // ---------- 泡泡（AI 助教、自言自語） ----------
  let bubbleTimer = null;
  function hideBubble() { bubble.hidden = true; }
  function showBubble(kind, who, text, meta) {
    bubble.className = `hd-bubble ${kind}`;
    bubbleWho.textContent = who;
    bubbleText.textContent = text;
    bubbleMeta.textContent = meta || '';
    bubble.hidden = false;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(hideBubble, kind.startsWith('ai') ? 9000 : 6500);
  }
  bubble.addEventListener('click', hideBubble);

  // ---------- 時鐘：變動時跳一下並顯示 +N ----------
  let lastClock = null;
  function updateClock() {
    const now = game.clockText();
    if (lastClock != null && now !== lastClock) {
      clock.classList.remove('jump');
      void clock.offsetWidth; // 重播動畫
      clock.classList.add('jump');
      const d = clockDelta(lastClock, now);
      clockPlus.textContent = d > 0 ? `+${d}` : '';
      clockPlus.classList.remove('on');
      void clockPlus.offsetWidth;
      if (d > 0) clockPlus.classList.add('on');
    }
    clockTime.textContent = now;
    lastClock = now;
    clock.classList.toggle('late', game.getState().clock >= texts.clock.dawn - 60);
  }

  // ---------- 卡關 60 秒自言自語 ----------
  const idle = createIdleTracker((hints.idleSeconds ?? 60) * 1000);
  setInterval(() => {
    if (game.getState().phase !== 'playing') return;
    const pid = idle.check(Date.now());
    const line = pid && hints.puzzles[pid]?.idle;
    if (line) showBubble('idle', '（自言自語）', `「${line}」`, '');
  }, 1000);

  // ---------- 重畫 ----------
  let currentTarget = null;
  function render() {
    const st = game.getState();
    markVisited(st.room);
    updateClock();
    const { puzzle, other } = pickTargets(game, content);
    currentTarget = puzzle?.room ?? null;
    taskBody.textContent = taskText({
      puzzle, other, phase: st.phase,
      roomName: puzzle ? roomNames[puzzle.room] : '',
      otherRoomName: other ? roomNames[other.room] : '',
    });
    aiQuota.textContent = quotaText(st.aiQuota, hints.aiQuota);
    aiBtn.classList.toggle('empty', st.aiQuota <= 0);
    aiBtn.disabled = st.phase !== 'playing';
    phoneBtn.disabled = st.phase !== 'playing' && st.phase !== 'finale';
    idle.track(st.phase === 'playing' && puzzle ? puzzle.id : null, Date.now());
  }

  // ---------- 按鈕 ----------
  aiBtn.addEventListener('click', () => send({ type: 'HINT' }));
  phoneBtn.addEventListener('click', () => {
    // 整晚點：核心回「等交完再看」；報告交完後（finale）就是真的點開未讀，核心依圖鑑門檻回應
    if (game.getState().phase === 'finale') send({ type: 'FINALE', choice: 'unread' });
    else send({ type: 'PHONE' });
  });

  // ---------- 事件 ----------
  bus.on('hint', (ev) => {
    if (!ev.text) return showBubble('ai', 'AI 助教', '現在沒有需要提示的關卡。', '');
    showBubble(ev.quotaOut ? 'ai out' : 'ai', 'AI 助教', ev.text, ev.quotaOut ? 'AI 額度已用完' : `剩餘 ${ev.quota}／${hints.aiQuota} 次`);
    idle.reset(idle.key, Date.now()); // 剛問過助教，卡關時間重算
  });
  const restartIdle = () => { hideBubble(); idle.reset(null, Date.now()); };
  bus.on('new_run', () => { visited = new Set(); writeVisited([]); restartIdle(); });
  bus.on('retry', restartIdle);
  bus.on('death', restartIdle);
  bus.on('solved', hideBubble);
  bus.on('_flush', render);

  // 目標框會閃，固定頻率重畫小地圖
  setInterval(() => drawMap(game.getState().room, currentTarget), 250);

  render();
  drawMap(game.getState().room, currentTarget);
}

__exports.initHud = initHud;

});

__def("game/ui/audio-logic.js", function (__require, __exports) {
// 音效的純邏輯（不碰 Web Audio），方便測試。
// 每個音效是一串音符 { f: 頻率 Hz（0 = 休止）, t: 起始秒, d: 長度秒, w: 波形, v: 音量 0~1 }。

const SFX_NAMES = ['interact', 'solve', 'death', 'ending', 'step', 'bump', 'pickup', 'door', 'buzz', 'chain'];

const note = (f, t, d, w = 'square', v = 0.5) => ({ f, t, d, w, v });

const SFX = {
  // 互動：短短一聲
  interact: [note(660, 0, 0.05), note(880, 0.05, 0.06)],
  // 解開：上行三音
  solve: [note(523, 0, 0.09), note(659, 0.09, 0.09), note(784, 0.18, 0.09), note(1047, 0.27, 0.2, 'square', 0.45)],
  // 死亡：下行，最後一個低音
  death: [note(440, 0, 0.12, 'sawtooth', 0.45), note(330, 0.12, 0.12, 'sawtooth', 0.45), note(220, 0.24, 0.12, 'sawtooth', 0.45), note(110, 0.36, 0.3, 'triangle', 0.6)],
  // 結局：小段旋律
  ending: [note(392, 0, 0.14, 'triangle', 0.6), note(523, 0.14, 0.14, 'triangle', 0.6), note(659, 0.28, 0.14, 'triangle', 0.6), note(784, 0.42, 0.14, 'triangle', 0.6), note(1047, 0.56, 0.4, 'square', 0.4)],
  // 腳步：很輕的一下
  step: [note(140, 0, 0.03, 'triangle', 0.18)],
  // 撞牆：悶悶的一聲
  bump: [note(95, 0, 0.07, 'square', 0.35)],
  // 拿到道具：叮叮
  pickup: [note(988, 0, 0.07), note(1319, 0.07, 0.14, 'square', 0.45)],
  // 開門換房間
  door: [note(220, 0, 0.06, 'triangle', 0.4), note(165, 0.06, 0.1, 'triangle', 0.4)],
  // 手機震動
  buzz: [note(180, 0, 0.06, 'square', 0.25), note(180, 0.1, 0.06, 'square', 0.25)],
  // 警衛鎖門的鐵鍊聲
  chain: [note(310, 0, 0.05, 'sawtooth', 0.3), note(280, 0.07, 0.05, 'sawtooth', 0.3), note(330, 0.14, 0.05, 'sawtooth', 0.3), note(120, 0.3, 0.25, 'square', 0.45)],
};

/** 取得某個音效的音符；沒有這個名字回傳空陣列。 */
function sfxNotes(name) {
  return SFX[name] ?? [];
}

/** 音效的總長度（秒）。 */
function sfxDuration(name) {
  return sfxNotes(name).reduce((m, n) => Math.max(m, n.t + n.d), 0);
}

/** 事件 type → 音效名（沒有對應就是 null）。 */
const EVENT_SFX = { ui_interact: 'interact', item: 'pickup', solved: 'solve', death: 'death', ending: 'ending', moved: 'door', cutscene: 'chain' };
function sfxForEvent(type) {
  return EVENT_SFX[type] ?? null;
}

/** localStorage 存的靜音值 → 布林。只有明確存了 '1' 才是靜音。 */
function parseMuted(raw) {
  return raw === '1';
}
function serializeMuted(muted) {
  return muted ? '1' : '0';
}

__exports.sfxNotes = sfxNotes;
__exports.sfxDuration = sfxDuration;
__exports.sfxForEvent = sfxForEvent;
__exports.parseMuted = parseMuted;
__exports.serializeMuted = serializeMuted;
__exports.SFX_NAMES = SFX_NAMES;
__exports.SFX = SFX;

});

__def("game/ui/audio.js", function (__require, __exports) {
// 8-bit 音效（WP7）：全部用 Web Audio 在程式裡合成，沒有外部音檔。
// 瀏覽器第一次互動前不建立 AudioContext（不然會有警告）；API 不可用時安靜略過。
const { sfxNotes, sfxForEvent, parseMuted, serializeMuted } = __require("game/ui/audio-logic.js");

const MUTE_KEY = 'latia-mid:muted:v1';
const readMuted = () => { try { return parseMuted(localStorage.getItem(MUTE_KEY)); } catch { return false; } };
const writeMuted = (m) => { try { localStorage.setItem(MUTE_KEY, serializeMuted(m)); } catch { /* 拿不到就只留在記憶體 */ } };

function initAudio(ctx) {
  const { bus, debug } = ctx;

  const link = document.createElement('style');
  link.textContent = __CSS["game/ui/audio.css"];
  document.head.append(link);

  let muted = readMuted();
  let ac = null;            // AudioContext，第一次互動後才建立
  let unlocked = false;     // 使用者互動過了嗎
  let broken = false;       // API 不可用或出錯，之後一律略過
  // 除錯用計數：triggered = 事件觸發次數，played = 實際送進 Web Audio 的次數
  const stats = { triggered: {}, played: {}, muted, state: 'none' };
  const bump = (o, k) => { o[k] = (o[k] || 0) + 1; };

  function ensure() {
    if (broken || !unlocked) return null;
    if (ac) return ac;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { broken = true; return null; }
      ac = new AC();
    } catch { broken = true; return null; }
    return ac;
  }

  function play(name) {
    bump(stats.triggered, name);
    if (muted) return;
    const a = ensure();
    if (!a) return;
    try {
      if (a.state === 'suspended') a.resume().catch(() => {});
      const t0 = a.currentTime + 0.01;
      for (const n of sfxNotes(name)) {
        if (!n.f) continue;
        const osc = a.createOscillator();
        const gain = a.createGain();
        osc.type = n.w;
        osc.frequency.value = n.f;
        const peak = 0.12 * n.v; // 整體小聲一點
        gain.gain.setValueAtTime(0.0001, t0 + n.t);
        gain.gain.linearRampToValueAtTime(peak, t0 + n.t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + n.t + n.d);
        osc.connect(gain).connect(a.destination);
        osc.start(t0 + n.t);
        osc.stop(t0 + n.t + n.d + 0.02);
      }
      bump(stats.played, name);
      stats.state = a.state;
    } catch { broken = true; }
  }

  // 第一次互動後才解鎖（瀏覽器規定）
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    ensure();
    for (const ev of ['pointerdown', 'keydown']) window.removeEventListener(ev, unlock, true);
  };
  for (const ev of ['pointerdown', 'keydown']) window.addEventListener(ev, unlock, true);

  // 事件 → 音效
  bus.on('*', (ev) => { const s = sfxForEvent(ev.type); if (s) play(s); });
  // 一般按鈕點擊也算互動（靜音鈕自己不發聲）
  document.addEventListener('click', (e) => {
    const b = e.target instanceof Element && e.target.closest('button');
    if (b && !b.classList.contains('au-mute')) play('interact');
  }, true); // 用捕捉階段，畫面層就算擋掉冒泡也收得到

  // 靜音開關
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'au-mute';
  const render = () => {
    btn.textContent = muted ? '音效：關' : '音效：開';
    btn.setAttribute('aria-pressed', String(muted));
    stats.muted = muted;
  };
  btn.addEventListener('click', () => { muted = !muted; writeMuted(muted); render(); });
  render();
  document.body.append(btn);

  if (debug) window.__audio = { stats, play, get muted() { return muted; }, get ctx() { return ac; } };
  return { play };
}

__exports.initAudio = initAudio;

});

__def("game/ui/flavor.js", function (__require, __exports) {
// 氣氛與台詞：主角的自言自語（進房間、開謎題、看線索、死掉重來）、拿到道具的跳字、
// 手機通知與旁白（照時鐘跳出來）、整頁跟著時間變天色。只聽事件、不送動作。
// 台詞都在 content/texts.json 的 flavor。
const { dueChatter, nextLine, skyColor, dawnLevel, TYPE_MS } = __require("game/ui/flavor-logic.js");

function initFlavor(ctx) {
  const { game, content, bus } = ctx;
  const F = content.texts.flavor;
  if (!F) return;

  const link = document.createElement('style');
  link.textContent = __CSS["game/ui/flavor.css"];
  document.head.append(link);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const sfx = (name) => ctx.sfx?.(name);

  // ---------- 對話框（畫面下方） ----------
  const box = el('div', 'fv-say');
  const who = el('div', 'fv-who');
  const line = el('div', 'fv-line');
  box.append(who, line);
  box.hidden = true;
  document.body.append(box);

  const queue = [];           // { text, speaker }
  let typing = null;          // setInterval id
  let hideTimer = null;
  let full = '';

  const blocked = () => !!document.querySelector('#screen-root .sc-overlay') || game.getState().phase !== 'playing';

  function finishTyping() {
    clearInterval(typing);
    typing = null;
    line.textContent = full;
  }
  function hide() {
    finishTyping();
    clearTimeout(hideTimer);
    box.hidden = true;
  }
  function showNext() {
    const item = queue.shift();
    if (!item) return;
    full = item.text;
    who.textContent = item.speaker ?? '';
    who.hidden = !item.speaker;
    box.classList.toggle('narration', !item.speaker);
    line.textContent = '';
    box.hidden = false;
    const chars = [...full];
    let i = 0;
    clearInterval(typing);
    typing = setInterval(() => {
      i += 1;
      line.textContent = chars.slice(0, i).join('');
      if (i >= chars.length) finishTyping();
    }, TYPE_MS);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { hide(); }, Math.max(2600, chars.length * TYPE_MS + 2200));
  }
  box.addEventListener('click', () => { if (typing) finishTyping(); else hide(); });
  const say = (text, speaker = F.speaker) => { if (text) queue.push({ text, speaker }); };

  // 有空檔就講下一句；死因卡、結局、開場這些畫面蓋著的時候先等
  setInterval(() => {
    if (blocked()) { if (!box.hidden) hide(); return; }
    if (box.hidden && queue.length) showNext();
  }, 200);

  // ---------- 拿到道具 ----------
  const pop = el('div', 'fv-item');
  pop.hidden = true;
  document.body.append(pop);
  let popTimer = null;
  function showItem(id) {
    const name = F.items?.[id] ?? id;
    pop.replaceChildren(el('span', 'fv-item-icon'), el('span', 'fv-item-label', '獲得'), el('b', '', name));
    pop.hidden = false;
    pop.classList.remove('on');
    void pop.offsetWidth;
    pop.classList.add('on');
    clearTimeout(popTimer);
    popTimer = setTimeout(() => { pop.hidden = true; }, 2200);
  }

  // ---------- 手機通知（右上角，HUD 下面） ----------
  const stack = el('div', 'fv-notes');
  document.body.append(stack);
  function notify(c) {
    if (c.narration) { say(c.text, ''); return; }
    const n = el('div', 'fv-note');
    n.append(el('div', 'fv-note-from', c.from), el('div', 'fv-note-text', c.text));
    stack.prepend(n);
    sfx('buzz');
    setTimeout(() => n.classList.add('out'), 5200);
    setTimeout(() => n.remove(), 5800);
    while (stack.children.length > 3) stack.lastChild.remove();
  }

  // ---------- 每局的記錄 ----------
  let seenRooms = new Set();
  let seenIntro = new Set();
  let counts = {};
  let shownChat = new Set();
  let retryN = 0;
  const chatter = F.chatter ?? [];

  function resetRun(markPassed) {
    seenRooms = new Set();
    seenIntro = new Set();
    counts = {};
    retryN = 0;
    shownChat = new Set();
    queue.length = 0;
    hide();
    // 重新整理接著玩時，已經過去的通知不要一次全部跳出來
    if (markPassed) for (const i of dueChatter(chatter, game.getState().clock, new Set())) shownChat.add(i);
  }
  resetRun(true);
  seenRooms.add(game.getState().room);

  // ---------- 天色：整頁背景跟著時間變 ----------
  function paintSky() {
    const clock = game.getState().clock;
    const root = document.documentElement.style;
    root.setProperty('--sky', skyColor(clock));
    root.setProperty('--dawn', String(dawnLevel(clock)));
  }

  // ---------- 事件 ----------
  bus.on('new_run', () => {
    resetRun(false);
    const st = game.getState();
    seenRooms.add(st.room);
    for (const t of F.roomEnter?.[st.room] ?? []) say(t);
  });
  bus.on('moved', (ev) => {
    if (seenRooms.has(ev.room)) return;
    seenRooms.add(ev.room);
    for (const t of F.roomEnter?.[ev.room] ?? []) say(t);
  });
  bus.on('ui_open_puzzle', (ev) => {
    if (seenIntro.has(ev.puzzle)) return;
    seenIntro.add(ev.puzzle);
    say(F.puzzleIntro?.[ev.puzzle]);
  });
  bus.on('ui_interact', (ev) => {
    if (ev.kind !== 'text') return; // 線索、已解開的謎題
    const t = nextLine(F.quips?.[ev.id], ev.id, counts);
    if (t) say(t);
  });
  let lastDeathId = null;
  bus.on('retry', () => {
    if (lastDeathId === 'd_door') return; // 推門那次是真的走出去又走回來，不是「想像」，不接重來的台詞
    const lines = F.retry ?? [];
    if (lines.length && retryN++ % 2 === 0) say(lines[(retryN >> 1) % lines.length]);
  });
  bus.on('item', (ev) => { showItem(ev.item); });
  bus.on('death', (ev) => { lastDeathId = ev.death?.id ?? null; queue.length = 0; hide(); });
  bus.on('ending', () => { queue.length = 0; hide(); });
  bus.on('_flush', () => {
    paintSky();
    const st = game.getState();
    if (st.phase !== 'playing') return; // 死因卡蓋著的時候先不跳，重來後再跳
    for (const i of dueChatter(chatter, st.clock, shownChat)) {
      shownChat.add(i);
      notify(chatter[i]);
    }
  });
  bus.on('debug', (ev) => { if (ev.did === 'jump' || ev.did === 'clock') resetRun(true); });
  paintSky();

  if (ctx.debug) window.__flavor = { say, notify, queue };
}

__exports.initFlavor = initFlavor;

});

__def("game/ui/debug-logic.js", function (__require, __exports) {
// 除錯面板的純邏輯（不碰 DOM），方便測試。

/** 網址裡有哪些除錯參數，回傳 [{ key, value }]（只列 TECH.md 第 9 節那幾個）。 */
const DEBUG_PARAM_KEYS = ['jump', 'death', 'ending', 'unlock', 'clock'];
function activeDebugParams(params) {
  if (params.get('debug') !== '1') return [];
  return DEBUG_PARAM_KEYS.filter((k) => params.get(k)).map((k) => ({ key: k, value: params.get(k) }));
}

/** 時鐘輸入 → 分鐘數（整數 0~1439）。看不懂就回傳 null。支援 "410" 或 "06:50"。 */
function parseClockInput(text) {
  const s = String(text ?? '').trim();
  let n;
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (m) n = Number(m[1]) * 60 + Number(m[2]);
  else if (/^\d+$/.test(s)) n = Number(s);
  else return null;
  return n >= 0 && n < 1440 ? n : null;
}

/** 面板下拉選單的選項：{ id, label }。 */
function debugOptions(content) {
  return {
    puzzles: content.puzzles.map((p) => ({ id: p.id, label: `${p.id}　${p.title}` })),
    deaths: content.deaths.map((d) => ({ id: d.id, label: `No.${d.no}　${d.title}` })),
    endings: content.endings.map((e) => ({ id: e.id, label: `${e.title}（${e.id}）` })),
  };
}

/** 面板按鈕 → 要送的動作。值不合法回傳 null（不送）。 */
function buildDebugAction(kind, value, content) {
  switch (kind) {
    case 'jump': return content.puzzleById[value] ? { type: 'DEBUG_JUMP', puzzle: value } : null;
    case 'death': return content.deathById[value] ? { type: 'DEBUG_DEATH', death: value } : null;
    case 'ending': return content.endingById[value] ? { type: 'DEBUG_ENDING', ending: value } : null;
    case 'unlock': return { type: 'DEBUG_UNLOCK_ALL' };
    case 'solve': return { type: 'DEBUG_SOLVE_STAGE' };
    case 'clock': { const n = parseClockInput(value); return n == null ? null : { type: 'DEBUG_CLOCK', clock: n }; }
    default: return null;
  }
}

/** 清存檔只清遊戲自己的存檔（這一局、圖鑑、去過的房間），不碰別的東西，也留著靜音設定。 */
function isSaveKey(key) {
  return /^latia-mid:(run|codex|visited):/.test(String(key));
}

/** 清完存檔要回去的網址：留在同一頁，只保留 debug=1。 */
function cleanDebugUrl(href) {
  const u = new URL(href);
  u.search = '?debug=1';
  u.hash = '';
  return u.toString();
}

__exports.activeDebugParams = activeDebugParams;
__exports.parseClockInput = parseClockInput;
__exports.debugOptions = debugOptions;
__exports.buildDebugAction = buildDebugAction;
__exports.isSaveKey = isSaveKey;
__exports.cleanDebugUrl = cleanDebugUrl;
__exports.DEBUG_PARAM_KEYS = DEBUG_PARAM_KEYS;

});

__def("game/ui/debug-panel.js", function (__require, __exports) {
// 除錯面板（WP8），只在 ?debug=1 時載入（main.js 動態 import）。
// 按鈕送的都是核心的 DEBUG_* 動作；沒開 debug 時核心本來就會拒絕，這裡也直接不建立面板。
const { isDebug } = __require("game/core/index.js");
const { activeDebugParams, debugOptions, buildDebugAction, isSaveKey, cleanDebugUrl } = __require("game/ui/debug-logic.js");

function initDebugPanel(ctx, root) {
  const { game, content, bus, send, params } = ctx;
  if (!ctx.debug || !isDebug(params) || !root) return null; // 沒開 debug 一律不出現

  const link = document.createElement('style');
  link.textContent = __CSS["game/ui/debug-panel.css"];
  document.head.append(link);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const btn = (label, fn, cls = '') => {
    const b = el('button', cls, label);
    b.type = 'button';
    b.addEventListener('click', fn);
    return b;
  };
  const row = (...kids) => { const r = el('div', 'dbg-row'); r.append(...kids); return r; };
  const select = (opts) => {
    const s = el('select');
    for (const o of opts) s.append(new Option(o.label, o.id));
    return s;
  };

  const box = el('details', 'dbg');
  box.open = true;
  box.append(el('summary', '', '除錯面板'));
  const status = el('div', 'dbg-status');
  const log = el('div', 'dbg-log');
  const opts = debugOptions(content);

  // 送動作，回報核心的 debug／error 事件
  const run = (kind, value) => {
    const action = buildDebugAction(kind, value, content);
    if (!action) { log.textContent = `${kind}：值不合法，沒送`; return; }
    const evs = send(action);
    const note = evs.filter((e) => e.type === 'debug' || e.type === 'error').map((e) => (e.type === 'error' ? `錯誤 ${e.reason}` : `ok ${e.did}`));
    log.textContent = `${action.type}${note.length ? '　' + note.join('、') : ''}`;
  };

  const jump = select(opts.puzzles);
  const death = select(opts.deaths);
  const ending = select(opts.endings);
  const clock = el('input');
  clock.type = 'text';
  clock.value = '410';
  clock.size = 6;
  clock.title = '分鐘數（410）或 06:50';

  box.append(
    status,
    row(el('label', '', '跳關'), jump, btn('跳', () => run('jump', jump.value))),
    row(btn('解這一步', () => run('solve'))),
    row(el('label', '', '死法'), death, btn('觸發', () => run('death', death.value))),
    row(el('label', '', '結局'), ending, btn('看', () => run('ending', ending.value))),
    row(btn('解鎖全圖鑑', () => run('unlock'))),
    row(el('label', '', '時鐘'), clock, btn('設定', () => run('clock', clock.value)), btn('06:50', () => { clock.value = '410'; run('clock', '410'); })),
    row(btn('清存檔', () => {
      try {
        for (const k of Object.keys(localStorage)) if (isSaveKey(k)) localStorage.removeItem(k);
      } catch { /* 拿不到 localStorage 就只重新整理 */ }
      location.assign(cleanDebugUrl(location.href));
    }, 'danger')),
  );
  const active = activeDebugParams(params);
  if (active.length) box.append(el('div', 'dbg-params', '網址參數：' + active.map((p) => `${p.key}=${p.value}`).join('　')));
  box.append(log);
  root.append(box);

  const refresh = () => {
    const st = game.getState();
    status.textContent = `${game.clockText()}　${st.phase}　${st.room}　${game.currentPuzzle()?.id ?? '-'}`;
  };
  bus.on('_flush', refresh);
  refresh();
  return box;
}

__exports.initDebugPanel = initDebugPanel;

});

__def("game/ui/main.js", async function (__require, __exports) {
// 載入資料、建立 game、把事件分給各模組。只有 WP1 會改這支。
const { loadContent, createGame, browserStorage, debugActions, isDebug } = __require("game/core/index.js");
const bus = __require("game/ui/bus.js");
const { initRoomsPanel } = __require("game/ui/rooms-panel.js");
const { initWorld } = __require("game/ui/world/index.js");
const { initPuzzles } = __require("game/ui/puzzles/index.js");
const { initScreens } = __require("game/ui/screens/index.js");
const { initHud } = __require("game/ui/hud/index.js");
const { initAudio } = __require("game/ui/audio.js");
const { initFlavor } = __require("game/ui/flavor.js");

// 像素字型（base64 內嵌，由 scripts/build-font.py 產生）
const fontLink = document.createElement('style');
  fontLink.textContent = __CSS["game/ui/pixel-font.css"];
document.head.append(fontLink);

const content = await loadContent();
const params = new URLSearchParams(location.search);
const debug = isDebug(params);
const game = createGame(content, { storage: browserStorage(), debug });

// 畫面只送動作：送給核心，結果事件分發給各模組
const send = (action) => {
  const events = game.dispatch(action);
  bus.emit(events);
  return events;
};
const ctx = { game, content, bus, send, params, debug };

if (debug) window.__game = game;

// 開發時把 error 事件印到 console
bus.on('error', (ev) => console.warn('[core error]', ev.reason));

// 各模組掛上去（先掛監聽，再處理 debug 動作）
initRoomsPanel(ctx, document.getElementById('rooms-root'));
initWorld(ctx, document.getElementById('world-root'));
initPuzzles(ctx, document.getElementById('puzzle-root'));
initScreens(ctx, document.getElementById('screen-root'));
initHud(ctx, document.getElementById('hud-root'));
ctx.sfx = initAudio(ctx).play; // 腳步、撞牆這種很頻繁的音效直接呼叫，不走事件（不然每一步都會重畫整個畫面）
initFlavor(ctx);
if (debug) (await Promise.resolve().then(() => __require("game/ui/debug-panel.js"))).initDebugPanel(ctx, document.getElementById('debug-root')); // 沒開 debug 連檔案都不載入

for (const a of debugActions(params)) bus.emit(game.dispatch(a));
bus.emit([]); // 畫一次初始畫面



});

__defs["game/ui/main.js"](__require, {}).catch((e) => console.error(e)); // 入口有 top-level await，所以是 async
})();
