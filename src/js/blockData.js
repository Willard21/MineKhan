import { shapes } from "./shapes.js"
const blockIds = {}

const texturesFunc = function (setPixel, getPixels) {
	return {
		grassTop: n => {
			for (let x = 0; x < 16; ++x) {
				for (let y = 0; y < 16; ++y) {
					const d = Math.random() * 0.25 + 0.65

					const r = 0x4B * d
					const g = 0x7D * d
					const b = 0x40 * d

					setPixel(n, x, y, r, g, b)
				}
			}
		},
		grassSide: function(n) {
			const pix = getPixels(this.dirt)

			// Fill in the dirt texture first
			for (let i = 0; i < pix.length; i += 4) {
				setPixel(n, i >> 2 & 15, i >> 6, pix[i], pix[i + 1], pix[i + 2], pix[i + 3])
			}

			const { random } = Math

			for (let x = 0; x < 16; ++x) {
				const m = random() * 4 + 1
				for (let y = 0; y < m; ++y) {
					const d = random() * 0.25 + 0.65
					const r = 0x4B * d
					const g = 0x7D * d
					const b = 0x40 * d
					setPixel(n, x, y, r, g, b)
				}
			}
		},
		leaves: n => {
			const { floor, random } = Math

			for (let x = 0; x < 16; ++x) {
				for (let y = 0; y < 16; ++y) {
					const r = 0
					const g = floor(random() * 30 + 75)
					const b = floor(random() * 30)
					const a = random() < 0.35 ? 0x0 : 0xff

					setPixel(n, x, y, r, g, b, a)
				}
			}
		},
		hitbox: "0g0g100W",  // Black
		air: "0g0g1000", // Transparent black
		"acaciaLog": "0g0g6ÖïYÇQYåĭYÁAWÇUZ÷nH50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"acaciaLogTop": "0g0gbÖïYVQYÁ)HPjZġîHĕàWĨěZöNYāRYĉÃW?3Y1xizNj1g4Q??ÒUQTAGIĀāāIÏkãÑQ?Q]>čXVVVVPÂ)üÆòĀï]Á*ïÅVVïÆTBüÆÇýýPÀ5üÆÇïï]À5üÆVVýÆÁlXÆñòýPÂBüVVVV]Â)ü?QQ@]Ã)ĀĀIIII>ČQV?ÄVQTgNxg0iz(",
		"acaciaPlanks": "0g0g7ġîHĕàWĨěZāRYĉÃWöNYòiY4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂTAX40cùĪzSāAAā4ŁğãļłĞSA4PkiA9cë0PNgÐ0İAĽŔÉGËĞ",
		"andesite": "0g0g6éŞZâľHĆåZóEZÖĎYĒđY4ĎĨò61aĘĹĕĩ2BĜõwAħ]ĩŁV+peČ0ÚĘ^Úðj6Rĺc!ìóĎłTěd|ðŁÙüÃÖëēÒ+ë4ĻłÙ({*CħïĚ!S+rÖ)ĀÙgŀđĞłVĚSÚĩiÎëő$m3c)Ā",
		"bedrock": "0g0g5ÎðW(ĪWVVHþÇHwíW4JĀ|iów(Ī%IÁ(ĀPÒAķ{5j]J^ïJ^A+1FyúMyÎÙwĿTĘĳPkú(üRdĊÂdðłQĩóxiÆ1ùŀïĞ9òyÀÚ0ŃQùòcJ^c*hCkr1iòTĜ^(ĀĿERÀ",
		"birchLog": "0g0g8ŚĦYņ|HłÙZZZZĦšZÎâH)ĹYŖĵY0Č0Q4ëQ0rÎiÀÚJî04rÚ_ĝTĞĺSFÛđĘĔĝwòTBãĘ4]ÚìĻ?+łÖvĩÎwņŔğłÙjZÚëù]+Ŀ1iĿTĞĪÚŝĩB0ùfŜ&ķ6ĿQēĞŁČăÏļ%9Àł5wù",
		"birchLogTop": "0g0gaZZZŒĖHĂÆWÁ)Hľ8HıľYľEZĎÄHĖGHĢďH1xizNj1g4Q??ÒUQTAGIĀāāIÏkãÑQ?Q]>BXVVVVPÂ)üÆòĀï]Á*ïÅVVïÆTBüÆÇýýPÀ5üÆÇïï]À5üÆVVýÆÁlXÆñòýPÂBüVVVV]Â)ü?QQ@]Ã)ĀĀIIII>AQV?ÄVQTgNxg0iz(",
		"birchPlanks": "0g0g7ľ8HıľYľEZĖGHĢďHĎÄHĆCW4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"blackConcrete": "0g0g48wZ8MW4wZ8xWmeşŞÑØĪĳ9ŠóşĶøŞ;îŃÓyÀĈĶÃĞX^æĆşŒĔ<~Ŕ<ĢL4ĲţŘŇěøÌĩĶõ;ŞkŇěĚċŇŖĝĜř,ŉĩ",
		"blackWool": "0g0gfcMWcTH8MWgÁYoÎZcMHkÎZ8wZkÁY8xWAJYgTH4wZsßWwíH1w)5ÑßIFIĒQģ9Éĩr|ģŔô|Qő]ì|ę<bńìĕô8QGÆÂQDDd717rýbĒQOĠ^ØĒ]hĒ@ń5|ÕńQBĽ1ÉÇ:yÉĜGĠ8ĒĜĒńQĕ@ĻĠîEwIhQ0ÆGĠhGŅD)XĒò@őĻôç|ģŁŔôĿXČVXgùĿ1ŅęÚ0|",
		"blueConcrete": "0g0g3$ġW$ĠZ$İWlÀ?ÑT?QA]0@VUUh?Čkkw55kUÒoTlV0UhhgÑ0VUR0gÁ?QghX54UVS4Á0UýÁlÀUükÄ",
		"blueWool": "0g0gj$İH(ŀH$İW)ŀY-šW(İH)őW$ġW)ŐZ)ŀZ<:W-šH(ŀY$ĠZ.aH<aY-őW<qY.aY0Q1ùčMeAwR^kčúõ0óĭI$ÉĀ,ġczĉ8ĐI]]ō4Û#sŋï}>aJgŎ!ayg[hıŉĄ1FĩĨkcÂþTöIÈõĬEI8UĊpĵ1]ŊxĵA4Åoĉ#axĘR#oěąI!kĉĨ^àI?-ðßĿXcPhÀëXù1^îąI8}G;[ph5F2ìĊďhc-ŇōdıèJĮx4ÂıUSwhÊë5ĸK{ŇlÛ",
		"bookshelf": "0g0gtĚ*WĆkZāĻWéîZ$ìW)ĉHAÞWMÕZF,YSĨYùTWĒKYòŗYMóWáħHĤÁHãMWĞłHóEYi+YĵþZKĈHËħZdčWĦÓWVĈYPAY;ŚZÖÃW0RxcRgRgIw18RüXx^ÐĈë1ÂýFF^ĿþĈĈiĄŎđFXÑĎĊÏċŃŎđČíĿĎĊá3ńÅġĘĚŇōĆK2Ēý.m#wŋuňgMóÂĀ0Mõ020XgõygRh8K1^ÐmŀFcÂĀë3ĻÄĊmÂÃÙČĈkÒãĊmÃİb}ŊċļãċÉàļb@U3ńãćÉ!ćb}ŇaąīuĽŊýÙń06M^Ã06Mõ00",
		"bricks": "0g0g9ęXZāUWòĞHĬčWĊnZö>ZéjHÝŚWĒÆZ0iO(0k(0hUÒhhUÎhÔäGVÔáâÓy]RyA]RyO0gk(0giÎhlÑÒVVÑÒmÓäGÒÄáRyA]Qyy]0kO(gkO0hUÁhhÑÁhÓáÓVÓäÒVA]Ryy]Ryg0gi(0gkÎhhUÁhhÑãÓÓäãÓÓäRyy]QyAI",
		"brownConcrete": "0g0g3ÊňZKřWKňZqÖlÄÄÄĂþÏĉVÄÈTÈÏĂĎĒÄÒÒýÑāāÈÒVÒlÄVJāúÒþïĂýÓóÇāIĀĒāýÖþVāÖĎþIÄđĂÁVč",
		"brownWool": "0g0giÒ2WÖ2HÑřWÞiHåNZÖ2WâyYKřWÞyYÞiYìÃWéNZÚiHKňZéRZì>WåyYÚ2H0QxùĉMeAw[PüčúõhĩĭI$ÉĀĮġczĉ7Đð]]ō4Û#sŋï}OaJgŎa2yg[hıŉĄ1FĩĪXÁÂþTöIÈõĬEI8UĊpĵg]ŊpĵA4noĉb2ÞĘRbyěąðFüĎT^àI?-ðßĿîcPh{KXùhRÐĆC8}G;[ph5EĮìĆďhc:wōMıçĹĮwīÂĩkSy.Êì5ĶK{ňlÛ",
		"chiseledQuartzBlock": "0g0g6ņÙYŖĖHŖąZŒöYŊéWŚĦZ4Ja]+]5BrÙi]9,A0iÀdĞķ4üüd9wJ0Ń9_PFĘĿi2Ñ1Ę0ĜJÎxA|AČĨÀJPi@ëùā4kíPB.{4ìwJ0]Xû]mJ]òDw0iÀd*%AAù4û9CCĿ",
		"chiseledQuartzBlockTop": "0g0g5ņÙYŖĖHŚĦZŊéWŖąZ4ĊĻMJĈhĘ4ë6ŇgB1ìEŇgD2ì-zg+Tí0biiR÷RK002öĘ0(ĊÂJiJJPAJPA00põ039kÈöpz8,2ö+wÑ@RëĚwÝRìík8hĞ1ìĘgiRĻúJĈ",
		"chiseledStoneBricks": "0g0g7ĆÖZóEYÖĞYéŞZÇÒYÎðWåľY00]0ëRdĜłÖ+Ń&ŀAĞļü!090óáe2ŅÚĒÊe7JŀőÊ!nČïĒ)&cČìŏk!nČñE)aÿIBĐ)eðĲLEáeõĚİ!ÊdÉÑJÈáA2S0Jś:;ěç$üÂPAJPA",
		"coalBlock": "0g0g5sÞZkÁHc(Z4gHEĊY0ü_ÑĎĸAĊăÒ)SFĞòÚĚP|ċ1AĚÃÚg9FĚă$J^ÚĞòÕiûÖiPÑüĸy2ÃÒCI4üłÚkTF(ÉEĊ^ÚJú5NúFĜ]ÚüX5g9ÚĊxÙíÃÚgÃÕJăQJòQüł",
		"coalOre": "0g0ga÷-ZéŞZâľHÖĎYËâZAJH-ŚH)ĺH$ĚZPzZ00ixzyhhhxxQTj)iiOAÄáxñhkyoÔĀÁiyBßy]VRyhg1x02A>wwiRyiÕÑhAAÄXh@ú02lÖäiiyigAñRw1kTM2Qiiy?ÐhQAhxQyykÇâÀ4þÂO2@UyAâRxiyhähTh0hyx2g1ih",
		"cobblestone": "0g0g6ÚĞZÎðWĎĂHÁ?WĞłHóoY5C^óăl!ÈŋÄě?!ĈVĐmÕCíÕĈļ_KĿöCAđì_TãĬ?UļÕA!cĜbTęh|6wdþĹÆMÁSĜîÁĊó_wmüĈi$QģBmwÏĐr?MÈVmíÕ^ó8ĜlP)úT4ĿĐ",
		"cyanConcrete": "0g0g3lĿYlŏYlĿH1IÀpE?SmkÀw6PÁB?S4k299úkÄRPÒÎwĊ?A2ÑIĀ8püUiSÒgý95Eòak?ý?1RÀFÀKSÒù",
		"cyanWool": "0g0gelşYm8ZmFWmPHlşZm.WlŏYmÖZmÇHmoZlĿYmÇYmÖYm.H10zTÃKy6BGîā6pĎpôāĲF:ńĮ*x:ú#PģxçÇROÓimO6Ó_@1@pÎ1GîyJñÇGNhG*ģ1:Vģ<ÎĝTpmF6poÓý?GąGģOç*ĠJÂ24Vh<4lÓlhÓĤÓz%GÄļĮěFÖłāğĳFĚÃäh%gÑĚ1ĤúÉ4ô",
		"darkOakLog": "0g0g6;ĨZ(úW]ňZEìW(úHÇiY50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"darkOakLogTop": "0g0gb;ĨZ)ĉYAÞWsKZ{ĨY]ęHÀňY(ÝZ-úW;ĉW(úH1xizNj1g4Q??ÒUQTAGIĀāāIÏkãÑQ?Q]>čXVVVVPÂ)üÆòĀï]Á*ïÅVVïÆTBüÆÇýýPÀ5üÆÇïï]À5üÆVVýÆÁlXÆñòýPÂBüVVVV]Â)ü?QQ@]Ã)ĀĀIIII>ČQV?ÄVQTgNxg0iz(",
		"darkOakPlanks": "0g0g7{ĨY]ęHÀňY-úW;ĉW(ÝZEKZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"diamondBlock": "0g0g9_ĦHW÷HncHľZHZZZćťYÔŅWàŖWeŒZ00h01hg23QVO*ÄÐN4ÓàVKh7N4Ô*ÅK0GÂlâVã0ÔãÂlVÅK6VKo3VGãÒÄ1o3ÅGÓGK18lGãÔãK0ÏlGÓGÓÓ7ÏmãÒÄÓÓÅ8gÓVK65Ä8gÒÄ1gGKÏhGKh6Ó0ßgg1gÓ0ÔÆyíEIyIyI",
		"diamondOre": "0g0ga÷-ZéŞZâľHÒþHv|HGąWyÇY÷ģWľZHĊóW1gixzyg0hx(01iOxiOSjNzÄh01Ý*Ô1Ýyxhz(Þx2hgi-Ãiïzwy8U@Þ@hh3(åGO7gā*[1zïxh2nÞMB@Ô9úMxR(G3Nyhhg02*K1i3M2ÆU@20âÐxþ[ÝhiD01gÞyxhhhwhhh0",
		"diorite": "0g0g6óEYĎóWĦţWŒĖYĶ;ZåŎY4üİPĀă)yR×,gÎ+E?ĠóÒĜbÕX_{oî|iŀö+Ň]ČıÖoŀhĠFM2óöĞTQĻÉúpbĉĚjKĐŇNxRò+lÚóAA(Ã&njÝü^wĐìÞīĸX6įöĊcÒ+ŇNgÉ",
		"dirt": "0g0g7ĢlZýĜYåÃYÆřYðoHÚĞZâÑH4Č9PČg?ČÐSĈÉ9(J9Cĩ)yķBkaEðÂ%UÈ{üÉÖ)ù9Eù84Á]2Â$üòFkÃQČĂ?ČŁPwh?0ìKNÏFihČĎÃ{ĊRPAë?$ò{)9FXĺ1kòEiĊByÃ",
		"emeraldBlock": "0g0g6nkHqěHîŁZ>įHnãWuÏY0000019AĂÖ]ń800w0Ëc)ûJ@Ë8w00mV8wJÚoÒcwăúĀ?c(ĂúĀ?8(ŋ4gÒc(ŋCgÒcħĄim?gĩPAþ?cB01ĠÒgJPAJËg]4ù8ļ+łÚĞłÖ",
		"emeraldOre": "0g0gc÷-ZéŞZâľHÖĎYÁčWłťYnãW1ňY*ÐZ>įHuÏYnkH00ixzyhhhQg01QNikÄyhAÄhhhÔhT0Ô2yxh4ìg02hgg9ĂRzzwx-ýæìxkTA]ÿēXy?Î?ÎĢ0yhmßmÝ0h1Q(1(xgjpĀNyhhh1åÅĉgiyQiçæĚN0kÄiEĈ2wixÔ1(1g0hh0yg0ih",
		"glass": "0g0g5ĺĖYē|Y000æģHôcZ0000019AJPAú9wJPAû94JPAû8ČJPAû9AJPAü9AJPAû9AJPAü9AJPAü9AJPAü9AJPAü9AJPAüFAJPAk9AJPwüFAJPAúCpAJP9",
		"glowstone": "0g0g8ŢÔHĵlHïRYÚiWZZZZĴYòċYÞNH5+T%^ÄĈYĸäŁb?ŋćŢĘÌĶgÃŗãŝèĲ_mćĐÕÈ2wĕKŔùb~ŋ>rĜÍä$āĉÓĦÂñīČĒe+ÿĘFùÂÑDŚÜDïĳĦğşnœ5őjĩÈŗ#ò_ĭíćÜyćŃlŏÍĞť",
		"goldBlock": "0g0g9ŞNHšřWĹÃWZŠWZŢZZĜZZÐZZXYĵNH00h01hg23QVO*ÄÐN4ÓàVKh7N4Ô*ÅK0GÂlâVã0ÔãÂlVÅK6VKo3VGãÒÄ1o3ÅGÓGK18lGãÔãK0ÏlGÓGÓÓ7ÏmãÒÄÓÓÅ8gÓVK65Ä8gÒÄ1gGKÏhGKh6Ó0ßgg1gÓ0ÔÆyíEIyIyI",
		"goldOre": "0g0ga÷-ZâľHéŞZÖĎYąĩWËâZőÝZZĜYĊóWZŢH00hijhyyyiRzyz*xxO3UMlURw2*@TB@TizUÔ>0ÓíwzÔåÎjIgiwðã]hyyhOoÕíhmR3@8]0yNxxÔíë2VÃ2(I1OlQÐMyO(2)Óÿ>xQÎAoÔäì4Ôÿ8i@ìgxðÝyyI0Kywíhw2xy",
		"granite": "0g0gaĞÖWąčYúïWéUH{ĹZĞDHđĽHË3HıÆWŊaZ1xMihTÁmiãoMjMjNnhiCMûnlnihÅmÏNhNjzGwÎyjh+ÏjÞygMMmÐhjÓÏOjh1A,ÓMylxjÓÐNhMÓCM+ÐljmÓ2ÞMEh,+ÓnÎj>h+RRNMhMzhFiÓMDNÓxhoÓzãiÓgMÓh2yMMh+",
		"gravel": "0g0g8ÒÒYó7Zþ-ZÞĎYþÇHìŞZĚóWĚĢZ5,$âł#þģ_ĔÂ{ĝíİþĀĳĜĺÊĞ/ÚÓŋńĝôdlĈİÿİØ$#èßgŔùĿÒčģÎðÅÖ$ÇńčY#üŁĴáįÆĚěKĞj<Ùł#ĔłÙ..$BôFĒŁŌ(ĹÉĐþcGDÚ)ľË",
		"grayConcrete": "0g0g2)ŊZ-ŊZ00000000090000000000000000S100gg",
		"grayWool": "0g0gd-śW<4HTAZTkYTAY)ŊZ<kY-ŊZ?*W?AZ?)Z.4W-ŚZ00i0)ÀÓ7jIüh71Å1ĂhóÎ^QI>g!rq1ĒgòM1yV6cy5âa5051À1IyhmĀMI@0I>đ0!OđQÝûb15hc1pVj3IkIĂQó>đmM10ObA03VjĘVĀĬiÑI*>IüÎÁ^hĐIhĎNò0ÑĘÝþbĐg.0Ă",
		"greenConcrete": "0g0g2PÏHPßHh;ĒÉÙŐßÆðM!ľĈÇylĖ|aŗÈëÀļĸŚđøcKæÙ",
		"greenWool": "0g0gh|íWÁúZÁĉYÇĸH|úZVĨYÇĨYPßWVęYÓhYÁĉZPÏHËňHËŘHÇňHPßH|ßW0S1c4F÷4w7TÂúā^1įčĄ!rkĎMaOcÓČĬS@Ĭ4{2Āī5&!ëìõŖy91õ7.ħħ;13ĩċù1^@M9]q^ČČį8Âûl÷16ĩý÷M÷[k1yIÞEgyí,ą]1ÂýpFàcÑĘĬKĻíI80gëXÓ08ÃĄB8ÌGNfgķÑČďMÈÿpaæõĬFòÐgĎwċ]įQow-së5öÀ^Ň0Ù",
		"ironBlock": "0g0gbĺ;ZĪcWŚĶWŖĦZŒĖYŎĆHĢŒYĚĲWņéZŊ÷WľËH1g0001hgiyyO)VVÁlVVVVVVÄäIIIāĂĒďiyyzOVVÄlVVVVVVÄäIIāāĒĒďizOOVVVÄlVVVVVVÄäIIIòāĒďiyyzO*VÄlVVVVVVÄäIIòāĂĒďiyzO*VVÄlVVVVVVÄhhhmÎÓÓÓ",
		"ironOre": "0g0g9÷-ZéŞZâľHÖĎYâüZòļHĖ,HŁġWŊaY1hixzyy0hzMg1?UiiÄÂjylÎhlÔ1zOxiyw0z*ÄÒOxghÄGñÎBKxg0ÔÝig1yjN01zMh0*ÐNkÄRig@ÔÝgÔ01M0ä3x0iyhh0ghkÀgiNÄ2?ÔãÂ5Ïgi6äK1gUxhg01hh0hyh0ih",
		"jungleLog": "0g0g9ÇhYÖNWéßHÀŘHSĸW;ĨWVMYâJHÎÏW1y3OOhg004S404VQQ@ä?US4xh0hy33O(Sh04Q6ñK03OÕÑ??Vh10OO02x??V1g>O(0iwQÁy00QOñðQO)Väë0hhgÕñ4?U>(>UhQ0xh6KQQjÕÓ3)Q010Q?ÀhTg01g>O00OO",
		"jungleLogTop": "0g0g9éßHÎÏWSĸW;ĨWĢmHđŌHĦ+YýČHąīY1xiOyi1g4Q??ÒUQTAGGñIIGÏkãÑQ?Q[>BáVVVV]Â)XÅäñâ[Á*âÅVVâÅTBXÅÆïï]À5XÅÆââ[À5XÅVVïÅÁláÅGäï]Â*XVVVV[Ã)X?QQ@[ÃAññGGGGRAQV?ÄVQTgzxg0izw",
		"junglePlanks": "0g0g7ĢmHđŌHĦ+YýČHąīYåÃHÖiZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"lapisBlock": "0g0gdB×YxPZ*āWMIYtFHxEYsŐWt8HoĿHoĿYt7ZFÆZkĮW100gzkkkljÁÄâÓâÆ5MnVâåÒæ7ÁVÒÁãÔæ5ÞÅGÒrãÈbVVGÔĝÄä5ĝââåÔÅ×7ÅÔGğþÔĂDÔããÅãýÈDÓÞÄãÓþÆ7ÖÒlÔÅÖÆnâāÔÓlãä5ãÇþÖâÅÙlÅÓÓþÔGÆ@ÅGÓãÓâÊoIIñõāĳĳ",
		"lapisOre": "0g0ge÷-ZéŞZâľHÖĎYËâZpÉZxÕYloZgłZĊóWhqZ?ĥZ×ÍHgŀZ1gixzyg0h)>w1jQiiÄÅ)Rwñh19aDĘhùyxiAR1Q2hgj?ĉjÕzwx]Ĥğ1Ĥ0h!ġā4Opw1bİ1/?GkRpúM/Éğ/OMOĊzôħ#Îhéĸgā1cęiādOçěĀĘ0iĤÁĤòFúixÉåpúyxhh9úhhh0",
		"lightBlueConcrete": "0g0g3C$Yy$HysHiVUS1kklk?ÀgVKk4ÂlVTVlÁhS5UhhlxTTÁkVÁ9ÁhVgFSÀ1ì5Ò5VÎkh??TlV4VlSl",
		"lightBlueWool": "0g0gq&ÙZNąW!ÊZ/ĴY@ťW&éW&öW=ŔZRŤZC;Y!ÙZC{Y~uH[eW+ĕHy$H!{Y+ĥH_eH/ńYRŔZRťWNąHC$YNöW=ńZ0Q1ùĎ/iĉö_pĿĭĉĵ2ĳŎħMÙąm^ÛQđ@M7oØDÆß#čxïJ;^NV,ħĳyhPí_yŃ1%ĩŌĀmÐ9Á÷zØeōMj8ÆīuÂ1ēzĆÂ?xòsĞĪõęĠRĪĔĻčŀFĿįĸõüùðP7ûÊOö>ÁàùĿü1ÝáĎĮĘÂā(Åp7@(ŒĉĿİwÛ{ÖEĭ{ÑðŐcŜÐ|òĹħÇÒ(È{I~wlĚ",
		"lightGrayConcrete": "0g0g2éŞHéŞWàĝGşąŁÊļņZÍŕYŜGHņ<Ŏŉ:|ĞćŠĞľŢŤÔŤŝ",
		"lightGrayWool": "0g0giðnYðnZí7Y÷-HþÇWJ]YþÆZéŞHí7HĆåHĂÖWóEWéŞWó-H÷-YJÆZóDZĂÖH0QxùxF÷xõ]pÂýpØi2Ğw#ÂþĻđĲNĆśČĬo{čħ×aĻĉï!!ĩNoŎ8ĩyg[TĩĈĄ19ĩĜ4_^]ÎöÐÂ^ĜČĵ8Âûl^g{Ċþ!Oķlk(aĩìĔRaĽċąÒ9ÂþĥFU{ÑĐĬóþNõ>g^ÀħøgRÃąÒë}âA[p6śČĐåÂýoØ:ÌčĝP{@ĝcĎ^ín=2SUňTPÆ^ĉ5^",
		"limeConcrete": "0g0g3ÌĉYÏĉYÌúY402ë00ë88ùEwg1204000ëëëAwëw2A0ó2Ĉì4A14gh00020wEë01g00oĈìS081Ĉ820",
		"limeWool": "0g0ggÓęY×ĨYÏęYÛĸYç1YÓĨYãŘYÏĉYßňYÛňYßŘYñNH×ĸYÌĉYH1YHhZ1w)VÓßIyĂģ@ĳ2ÊĹj}ĪťõÛÓŢ×úÛĨ=ÊŕúĜċÇ@éÆÂQDDÌË1ËsB1ģ@O-_ÙģÕhģÓŋ5Û×śÓB@ÁÊÂ;yÊkľįÈģ+ģ~ÓĦÓśįċFBIh@5Èéqhľ~%)ðģĊÓŢ@õĺÛOŒZĄŏĎĜVðgB]1ŖMÑ5}",
		"magentaConcrete": "0g0g4ĐİZĐıWĐġZČġZ5ÒSüVÁPTÀUÆVÇ@Ŀì2Î^áÇĮSKÊ@ņ3Äĸ45Ä@9ÎVoRtÞä4VVx}ĕãÁxQâ11Àhïxl50Îĸ",
		"magentaWool": "0g0gsĘőHĜšYĔŁHĘŁHġbWĬ:YĘőYĨ#HĨ#YĐıWĥrWĔŁWĥbWĨrHļöWĬ:ZĠšZĜšZĐİZġaZİ{WĸÙYĥrHĬ#Yİ_ZĜőYĔıWĴÊH0QNkĭ/iBE_ÐÊŎĊhqĴp$Oéz/Ĺĸ?góġdKÜ]Xü)F@5ĿÙĳĩńFıõyüPÈ|>A1N>toÞàćßi×çø7.m8ÊŋuĀpė>ĞĀRnĄsĨĳ|ĊSRĳyśĎdOÊŐĉĵĬgñÁ7ċŉĎù{hĂķXĐpĚĻĎ%8ÂĄUPxUñ.ĢTőœxÁ{ĸPĵ÷ĖŀaFğàĴăwzÇęÎðýĀ~ìāś",
		"mossyCobblestone": "0g0gbÎŋWÁàYĎĂHÇĜWæ*HßlWÎðWóoYĞłHÚĞZÁ?W1yMj?6äBiñÞ)ÀÞÔÿÏßúÀ3úhåÓåMàågÀhđÎnÐÓâV3ì?ßþďwÝ,DgDåMnåiGhnúV1ÿÔúkÀgÝÀ+đjÃ0āG(j1å0MhpûgÂÞjj4ÁÎßDj?ú?5þGÿ47ÞÀÿåhåâååpGþn1nÓûhmÔíÝ",
		"mossyStoneBricks": "0g0gcóEYĆÖZÎŋWßlWæ*HÁàYéŞZÇĜWÇÒYåľYÖĞYÎðW1z)>xQ3?m7>R6ÓÏDgÔNNÓ(ãEmþÝ.KÖÖäpFþCÏ+ĂÕ9ßÖāzDãýĂGđďyGāÔģïģIïVÉģQMh81hjQw06ÕgK036KÓĀmùùCK6ÏĐpÖÓÝÓÓJĀ3@6āāđyĀ4ÖþÖĒGFÕÿåđĂĝVÉIïVģV",
		"netherBricks": "0g0g7oMW;ßHQJYwTH(ÎZEÁY-ÎZ000000BmÂQþòþÎČJKÑĂÅBĚÅA0+ħ0+ħÒAãÑĄ}7PAbPAæP%æ_čÙ03Ù03ŀčĂŀĕĆùÖ2ùÖ6ęŐuýİudĘłdĘłĲÔJ_ÓþJTČăTAJĸAJTA",
		"netherQuartzOre": "0g0gcÀÁHUíWÀÎYÑĊYÝĪWSÁHĕĭYľ#YĞĀZï4WŒąZÚÑW12NQOÃ)MjMBzQ5Ow>>l@äwN)ü)^GÑT3zPQďÑûQAM4@ôPÔØO>3QĜĢäĘ)ÑT5CðĜ>!òN)óKOQæÑzPďR))ĐĚk,ôÂ@QĜÂN@Ě5×SRi3>A-ä4-(k)P@ímòSzQûxÒ))Oy)R)lzQO",
		"netherrack": "0g0g7ÀÁHUíWÀÎYÑĊYÝĪWSÁHï4W4CČÛğp%ýÃIÄķ÷ORÒ6ĄĸĭõßgĺĂ)ōĵ?phú+úĎŊe#sö7)XUŊ2)ŝÖĭùÛ@s}ÕőÞį2MįőĂ?×Ö@ïÁóóe*o][oMİĈ]ġĈ}{ĸVĮrPįĄ*.r",
		"netherWartBlock": "0g0g5ä0WÕgWÆ0WüÎYĔíW02I0w10ÿ24Č1A2084oQ0ó{wwÀ0ùwJ1{8Ĺ04RE0h0Sù52ìwNë9A104ë809KkgQ4^Xy1SyIAùU1Ċ21gë4yg50g0wg17g1SÃ10ķ",
		"oakLog": "0g0g6âÐH{řHúīW-ĉYËyYāŋY50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"oakLogTop": "0g0g9ËyY{řHâÐHĢVZĖ*HĩãWéîHýĻWĆkZ1210x0g0jO))U>OM3ÓGñIIGÀ3ÒÃO)O,(4àQQQQ-Sjî[äñá,T4á@QQá[(4î[]XX-S4î[]áá,Skî[QQX[T4à[ãäX-S4îQQQQ,Sjî)OO*,T3ññGGGG(3OQ)?QO(1010x0i0",
		"oakPlanks": "0g0g7ĢVZĖ*HĩãWýĻWĆkZéîHÒRZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"orangeConcrete": "0g0g2ňëWńëWRgguhKoCįù124Sw0x8QùĜ2Áę1ÄSSSo40",
		"orangeWool": "0g0gmŐĈHŔĘYŌùHŌĈHŘĨWŠŘYŐĈYŜňHŜňYňëWŘĸWŌùWšRYš1ZŔħZŔĘZšiWšNHŘĸHŠŘZŜĸHšyH0QNkĭ/iBE_xĿĭĉĶqĳśI&Ùu]ĩ~QgðM7w_7ĤùOĉ25ö:õRýFNõyüPi|3A1NRŜĀÜÐCÂhıØeōMi8Æīudpô3ĆdR4ÓĄĶOĳĚ-ROĆĻčĻMĿĩxõÙgðT7îÌċùQhđSĤĐpõáčŎäÂþīPxUð(ŒTĿĭĉ~Ph7icö]ŏEŌÐ{ÖxŊÇăxĦcÝ}ĸāĘ",
		"pinkConcrete": "0g0g3ļĀZļāWĸĀZ5QSÀ14gkgk01gQ1À0gQ4000ghÀS0?0]9kgk41Q42T4g01hÁ105k4S4hS00gggQÁS",
		"pinkWool": "0g0gvŌŀYŔšWňİHř!YŝçYŌŐZŐŐZŝÉWŝØHŀđWňİYŝ/ZńġHř/YŝĳYŝôZřqHŕaHļāWŝĄWŝĤHŝ^ZŝĳHŝçHŕaWŝăZŀāWŐŠZŝôYŝĔWŝ_W0Q1ùĎ/ičĕ{ÖŃŎĊh3dp((èŉ/}ęQķô.7ÕÜ-Ňà$D+ïŀ;aĹË/ŁĳĩhPÏ_Nŏ1&îmooàġÞ÷bçø7.l8Êŋuå1ėOćġRpĤĄĠŃ{Ĩħ{Ń(ŤCuFŃňĉĵĶÀñ|7Œŉěö|ÁéŇŇI1ãáď7ħáĄĸĂpmñ-œTœœĉÞķĸ-eÛčr9ĔŞàĴĢċ0ÎàÀÏãë~ùlŚ",
		"polishedAndesite": "0g0g9ĎāZĞıZó.ZðEHéşWÞľWÖğWÇâYóPW11hhh1gijQ>OÃ)Ñ,jOO)SIO[3Õ8Q)Oî,jO*NîQQ,k>)Q*OQ@jOX-Iy)Åk>QQÄUO+jEÃO-ë8ñj>)>)>N,j-ëXQIO,mOOOIOIÅjIí)QÑ(ñjOQQOíQ,kQ]îO)>,ðGGGGÓGG",
		"polishedDiorite": "0g0g8Ŏ÷HłÚYĢœWĲ$YĒĢYåşWÎþWó-Y0i00J25+_5@VAkòKEĆ$ġz%)ýxįĀ!)Ĭ5ČįiC}cùTÛyĆ92Ī$ďmMĚÉQ-ą$þû%ČdB]ôÕĚ}cIł1üądíĻdjm9þĀ!(þtCİÖþąŞÉãĽŔÛ",
		"polishedGranite": "0g0g9ıÆWĞÖWĞDHđĽHąčYúïWéUHË3H{ĹZ00gwy2zz4VQU)QV?kk>)QÑR[4QÑVUOV@4QQ>VQQÄCUVQQÁU@5>)ÂQQQÅ4QQ@U>)@B@ÒQOQVBAQ?U?UQ@lQQQQAV@4TVQÑQ@Å4OQQ>)V[BU?ÏQU>+AQUQVQT[ÔGIGäGGI",
		"purpleConcrete": "0g0g4ÑòZÑåZKåYÑåYlm100ĸþTNVQgp5820Áĕ0S2RV1Àlhgìg4pĽjŏk0ÆT)S?lüUìlĻRS1ý0TTp0T]Q4T1",
		"purpleWool": "0g0gmÙóWÝĂHÕóWáĂYëģWÙĂWèĒZÑòZäĒYÕòZýcZXģWáĂHÑåZXĲHIĲYäĒZèĢZõłZXģHÙĂHIĲH0Q1ù5MeAwPTüčúì2^mČzÉí,Ģ1zċpEðS]ŇXÛ3sŋ5Ã(ħígŎĊaJg[PħŇs11ĩjü1ÂþTõÕÈõĬEù8UĊpĺ1]ŊpĺAÃPĀ1Ĉ^ÞĘPċ2ěąð1üĉĬ^ăI?-ðßĩîc]gcKXú0EÐĄC8}åĥDphlEĮòČđú1-ŉňöıéÀĮwīÂĲ]Qw]D05Ĺo|(1Û",
		"quartzBlockBottom": "0g0g3ŖĖHŖąZŒöY05Èë?ÈĐ1ÄĒù5Ēč0ÄčÈþĒÄĒÈđV0ĒV01VU1×À0þù05006Ē05ĒĈ0ÇÒ0Vč05ĎÀ1ÄS01Ē",
		"quartzBlockSide": "0g0g6ŚĦZŖĖHŖąZŒöYŊéWņÙY0000005AăÚJ{9+łÕJV%ĞĹAČý%AăÖ+Ń9+łPĞŃ9yPÚĜý4J^PAý4Čł]J|9+òAJV4JPB+Ń4JÂÚĞĴ4üĂ|y|9CĹAJV%)òAČüJłAJ_Ú",
		"quartzBlockTop": "0g0g6ŚĦZŖĖHŖąZŒöYŊéWņÙY0000005AăÚJ{9+łÕJV%ĞĹAČý%AăÖ+Ń9+łPĞŃ9yPÚĜý4J^PAý4Čł]J|9+òAJV4JPB+Ń4JÂÚĞĴ4üĂ|y|9CĹAJV%)òAČüJłAJ_Ú",
		"quartzPillar": "0g0g4ŊéWŖĖHŚĦZŒöYh&Ņtiu&%uŕĹň&ňŉŕŕ%xŅň%%&ňŕňyĹŉŉŉŅyŕ%uŕuńŕŅhĹňŅĹiňĹŉŉňuyŕ%&%Ŕtŕtĸ",
		"quartzPillarTop": "0g0g5ŊéWņÙYŒöYŖĖHŚĦZ54Ăó6ÁP4ù90úFDs÷)JÎ.rJ@ë1ħJP8ĩóQŋúđi^*i^FjòĝkíF2^?k×D4×?i2CĹ^QłúđkTħJP8ħ1.AJ@îPDAJ)úF0J90J8ęk|yò",
		"redConcrete": "0g0g1õíW",
		"redNetherBricks": "0g0g7$0WÕTHÝÁY)0WQgH-gHUMW000000BmÂQþòþÎČJKÑĂÅBĚÅA0+ħ0+ħÒAãÑĄ}7PAbPAæP%æ_čÙ03Ù03ŀčĂŀĕĆùÖ2ùÖ6ęŐuýİudĘłdĘłĲÔJ_ÓþJTČăTAJĸAJTA",
		"redstoneBlock": "0g0g5ŋëYĤëYČKYÝ(WüÀW0000004íÂQí]4XĂPyI4ċzßCI0đs}Q05@łÚĘI5ĐłÚİ8a@łÚĠù9ołÚİ859q÷]I5]łdīë4đsÛ]į5BAJAù0īköyI4ù9]J]000000",
		"redstoneOre": "0g0geJ-ZéŞZâľHÖĎYÖâZügHįgHţ0WŤâZīgHü0WťEYĦPWśÞZ00ixzyhhhxxhhjNiiOzQyxhhhi*VOyiyxCÄäĂiRhgwÿğħhÚwxhcĳ2ighA>zyhAQh%ï1g5ÒÕĹlĸh01įĥĨMxyOx$ĳyhj)Qhh0giBĽļTmķN0gôħyg2wixc1hh00hhhyg1ih",
		"redWool": "0g0gdüíWĀJWùíWĄJWĐĊWČĊWĈJWĠĹZĐĊHõíWĔĚHĔĊHĀíW1w)0VwÓ2*GïM21JjójĒÎÈVďVM^h/3ĒMçÃ3QFĭ2Q2ya919hw1GQO+ñÃGÄhGVē0^VēV$ĝ1Ĩ2OyĪoJ+5G*GĢVæVĐmÃ30Óh?0ĬylhJĢF)ÒGÂVďĝÎûÈOďĒOĎUäcÒgwĞ1ĒMÉ0ó",
		"sand": "0g0g6ŎăYł/WŊØWľpHĹŏYŖĔY4Ċĸ?ĊĂÑĚŁõr8@+9AĚŀFNĺPĊİÓþóEþ^$üúÒNÇKğÇÛiĲ$þ_%ĚbÒiĄÖüÇ5JÉ(ĚÃ(ĊıBoıÙüÇPĞÇÒĎôlmı?laEĊÇEĒú?oò?kó$üÁ",
		"smoothStone": "0g0g7éŞZâľH÷-ZĒĒYĊóWĚĲWĆåZ42ÂByg&,ÚĕŐqOÖsJ+ŀmĿłĞğy|İsãłp*ĞłÛÖĈ|łÒĕĭŀÃÖČĺPÕmĢŊÚĭő%ĞŊĞģÕ&.+úįŉdğÚĝģ×Â[ÙßÚqlįłĕĠĿN:Øãġx5wiSJg",
		"soulSand": "0g0g6ÇjYSĩH)ĊW]ĹZÖQHåïW4A3{č4ëhÕBCyÁĪFcĊňMItöþĩTįĴõĞ]dIUdħpÖ(KÙq3ÚC3ÏÈRc+İKPRì(qyĬoÖIħ}No{RĈÑwĺRĬwÒðĂëİÐAĞĀĐ^T$4Ĭö-pTÿd",
		"spruceLog": "0g0g6-úW(ÝY{ĨH$ÀY$ÝYUňZ50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"spruceLogTop": "0g0g8UňZQĩWÇiHìîYåÐHòûYÎyZÞRZ4wSQ20%ğsĚ+ŀd%ĦZŤĐdÈłÞğĀj.AJ[ŇLġğŢ[ĉj]ČûPĀjġĎĺĮŇjġĎĺ[ĈOġČûİĉj.ĚņĮŇjġAJ[ĈLğrÚľĉfŖĞłÚĀdġsþ@Ŀ40SQ2ë",
		"sprucePlanks": "0g0g7ìîYåÐHòûYÎyZÞRZÇiHUňZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"cherryLog": "0g0g5(ßY-íZQěYAÂWUĻW5yS4ë]w0JA+ħÙiUúwĿAðĿAČIw0]ÚĞħPi0díÂQ0łFy20ioA+ħÚFi0irÙ2ùÚðĿ1ĞħKgĨ?í]FFywly]ë9dë1Pi00JĿ0JÂPy>×QP",
		"cherryLogTop": "0g0g9AÂW-íZ(ßYōŢHōŁZŎrYĵoWŅåHŉĒW0ix0xh0h3O))U>O(jÓGñIIÓÁjÒÃO)O+MkàQQQQ-T3à[äñá+Ská@QQá@Mkî[]XX-Rkî[]áá+T4î[QQX@Skà[ãäX-TAîQQQQ,T3î)OO*+SjññGãÓÓÀjOQ)?OVÁgh0hwh2h",
		"cherryPlanks": "0g0g7ŎbYōŒHŎ$HŉĒWōıZŅåHĵoW4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"stone": "0g0g4÷-ZéŞZâľHÖĎY0ÖĢVÇýÅōÜēđVÀ?5×þĎSB?VØĠü8!VėĢÈý1k5ÄÁÀk1ŀėā×VTV4×@ÿŕ6þčĐÖVV0VÈTÒ",
		"stoneBricks": "0g0g7óEYĆÖZÇÒYéŞZåľYÖĞYÎðW4JPAù2$(0dĞĩxðłÙ8Ł&(sÎĮyNįĪß.ÈiğAõ^ŉĞłÚĞł×ŀ%JÉÚĞAJR4JPë0Łxë3dðŉ&8rK,!MĭĿÚĠŉi(ŋJĲÏdįŃĞł×ĞłÚłÚJ_ÚĞ",
		"tntBottom": "0g0g4ĘÂHĿęY÷-ZùęWkkkkØØØØØØØØZZZZkkkkØØØØØØØØZZZZkkkkØØØØØØØØZZZZkkkkØØØØØØØØZZZZ",
		"tntSide": "0g0gaŐ1YĿęYĘÂHùęWZZZĶ;ZņÚY)ļHoÐZĦĲW0i0i0i0ihzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhz?ÓVÓÒÄÓÑ@GðâÆÔäUÖÆVGÅÄãÓ?ÔÓãGVïþ@ÆÄâÆVðUāāāāāāāāyOyOyOyOhzhzhzhzhzhzhzhzhzhzhzhzyzyzyzyz",
		"tntTop": "0g0g7ĿęYŐ1Y÷-ZĘÂHVVHùęWgTZ4ë]4ë]FNûFNû!ÂĎĸËýÛĮĕÜÓŔ4œ]4Ň]FNěó;û!]ĞŀÇýÛľ+Ĺ[ĕ4òĞłc]!{ĞĹ;û!ÃþĸÖlÛŀĔøÄŔ4ħÝĿį]!NċMOjFÂýFÂýÛĽŔÛĽŔ",
		"waterStill": "0g0g8Īc%ĖĢŔĎĂÚĺ|%Ķ;ŔľËÚZZŔŢŖĕ4üúAùŌPyPBAJBAJA0ÂFy1A2P]JJ?AP]ĊTAiJ4JPAþŗÞJTAJSŀñĀwë_PAJPAÂFAÂQíPPAJPAúPAJPkJFAPA2óPAúzÕawÿşAiP",
		"whiteConcrete": "0g0g3ĶËHĺËHĶ|H4?541S4k40ggh50g?À0Àk1wA0l4g04U0kQ?À4l00U01hÁ0044Àl0hÁ1QÀkTg4Á5h",
		"whiteWool": "0g0gnłêWŊĆHľéZłéZŒĖYŞņHł÷Wņ÷WŚĶWŚņHĺÚYŒĦZľÚYŖĶWZZZŢŖYŎĆYĺËHľÚZŎĖYŖĦZĺËYŞŖY0QNkĮRU*ĔÙÉÊŎĎ1reoįOçĪ,=ì_Ĺÿ.%Æ^ŗXø)uŜïĶÙĳĚýV/Ķyü×J÷ŚU1*RmsÎàĔÂiØçú7.)8ÊŋĉŖpıś*Ŗ^ÑGĈĨ-}ĩSÂ;2šĒdOÊŐčĵçĹÿ<EçĩĞùØpĂķXđp÷ļE%8×ďĢVxÄÿ.Ĕ^sŎčÎĔĹŠĴŕàÿ7ĕčàĵæAzÎćTïŕĀÀŘāŖ",
		"yellowConcrete": "0g0g4řĨHřęHřĨYŕęHlV01zs@S1àÁá?ħń4S9551ÿOÄúKV14ÁVÁN[lÃÆśÁllħħĬĨRļŗh(0oUVUV{Á{0SľQh",
		"yellowWool": "0g0gjŝňZŝŘZŝĸYŝňYŢiHZ>WŢyYŢNZřĨHřĸYZÐZŞ2WŢ2WZÃHZÃYŢyHZNZZ>HŝřW0QNk0MķygPxüĊąØqSĜA$#ÄĮ*Œ:}GEōwKļXö2ŁĹ5ÁO0RĨ890yü]^0ķw122ĜëßÂô2hX!õĝEŖ8Uċāęowĺpę.ĹoĀ1aħJ$RaŋUxÓ1üĎt^ô}â)ōÖÄ>gQgcKXďo2Ñy@8ÀIĠ]x]âEİ.ĄĐĄô>eĽMĒàIĞùķÁSnĄz]yŘïĖK|hëĕ",
		"light": "0g0g1Zŗ7",
		"lightIcon": "0g0g1ZŗA",
		"lavaStill": "0g0g*ńĨZļÀZńęYőîZōÐHńřWįŇHĴgYĸSZŀúHńŉWļìWļÞWŉ2HŀęYĸÁWŉyYŉ2YōÃHŉiYňřHįŗHĸwYļÎWĸ(ZńřHŉNZŢďWŕĻYŀĉYĴwYĴ0YńĸZńęZŕīYŕīHĸÀZōOWŀìHŉiZőČWőüWŕŋZŕĻZĸ(YŉyZįķHőĜHīķHŚ*YōÐYőîYōàY0gRcTToß1Ay^EJĳ)ŉI;Č1MkûÀĹTxVÿK6]5ĎŃÁķÆåŚwïÔĿCDz0ëÆÏ>ÒÑāĀAOÈáî8ù9Ã(İıxĹ^BGP-^0èőÃÆňË%âĨÓĒĴuĪIoí11ď]Îm÷tŞįxVõĝAòäíĽqŌĄĥð5ÖēħęÎĘVŚMĥïĈwĩĳ~#&tñąMVĔ(mnĴħÍKĩIoÏ9ĥ*ńCÒ[(üįKàEĒĉÈMÎýÆî9ĜùÈEÆ)|ķ[éKUPlİ",
		"obsidian": "0g0g540Y00WgMZ-ýHAàZ4Jg&1s4yìÕ8ķBĠQòl8&B28ùìMAPAë8Pië1ħ9]EŃ6g]5)óAJňBīüëĀJIüASĈëSg20ücE4RdīJdĊJö4ķú0a]0K(4w9g]SĊkQ00",
		"cryingObsidian": "0g0g840Y00WE7YgMZ-ýHAàZKqYë&H4üoNìÒ4NúõØoC^?ĕŞ]Âğàfúú*)Ğţë(ÜŉħqÀhŃ:y6Ą^5ĭťQŊFCVńēqł~nŜÐ(řÖÛ20ÿö$DîiÄĹiNăě6ĀĝõbÜAÕ)ÓEpü]KŉtÕ0ë",
		"chiseledNetherBricks": "0g0g7QJY(ÎZ;ßH-ÎZEÁYoMWwTH0229238EpAĐýgĠòAĐd{łÚĞŁd,UĂ?ĕĕQķjPcąQĹóBsdcĻÂScĴ:VĚÉ#Úcķh]õdQĹŝŀĂdQķòSaĴ:ØĞĞłĝTĤħ0ctQĂİ%ĂËçØĞłØĝ",
		"crackedNetherBricks": "0g0g8oMW;ßHQJYwTHEÁY(ÎZ-ÎZ8gH000000BmÂXþđĚňĐĽŇ?Ġ[ÕĞĮÕ0+ħ0+ħÒzśÔs}7ÁÚałAæņÑæİAÙ00c03ŀŜîŘĖuĜb[ĿÎ@ýŖÌĝŢÌdĘłdĘłĴÔJĽÄťĖĸĕþĨļĝĨÙJÁĕ",
		"crackedPolishedBlackstoneBricks": "0g0g6(ěH|BHkMW;ŋHAìZsTY4ĊÇ(þĩcwÉeëqcīŇöĸÈ×6îÎēR{0o192ìę0óPÏúXAóôÏĝ#Â^łÚ$ĉyĘyÇ1ĉyìmÉìĂyÀþĿK/2A+îÖëJÒXy8]2Ù_$þĲ!2_Ú^ŁJ^ēÂ",
		"crackedStoneBricks": "0g0g7ÎðWéŞZĆÖZåľYóEYÇÒYÖĞY5CJFFBīùÑÝĪdQ6{-ù|Ï!PA0ń?ĀpÒíŜöĞĵïĨËçÙŝĶ<?2ķ%Ĉ00P8ĬNīJCÏâõOcùħËÎįTAĂE@i9AŌBQĀpÜRËõġÉŀōĴç<Û00%Ĝ00",
		"endStoneBricks": "0g0g8ĩŏYŒłWŖŃYŖőZĒñHņĂHĶ.HľÇH4ČJÚCQčJÉČJÛÓJŀAě},ł|ĕĞÛĜĞÚ)ěÕĦûÜŝłÕvZZğZīî0AùcA|ČIëĜJAĚ|kJPAĂŀcJŀ)ĞÚĭĽĴĔņŖĽĆÚŝš~mŢHğZşîZZëÙ4J1A",
		"polishedBlackstoneBricks": "0g0g6(ěH|BH;ŋHkMWAìZsTY4ĊÁEüî8wÂi0j8ČĈúEûT42T9Ð]0g0_Ðì#0þ_3ú8AþI3ĝģÉÛłÚEüûęiÁ14j8AÂìkûëüùSwċ]A2T8z?8wgPØ]_$þĲ#2_ÚÛŁłÛģÉ",
		"prismarine": "0g0g5ÌāH@DHă#ZæŁYR6Y5({ÕIăgiú|Āoí)Ĩc?8^m0wĎAÙRSïĘ^KmAwkāëębÓ)ĳiiÈ}6R5Cj0új9íĿ5F0$8SFíň(Qį$2ûÓCĳÑīħ2(zPþ00þ4{NcúĐ1X1i",
		"prismarineBricks": "0g0g8ÛőZÿ;HîrZ@DHÈĢHR6YÂÕWÏāY4J]QJî(0BwSz(86wå5g~ōST<2x<S9:y1Bĩ8jÂ1őĊPĪuTùÿĶŢÊ{SiZ3;ÏA2Ñ3ÌÐ4jŉ<ÍŋDûÐŌjŊWťÃŊiÒZJÒBăŀWłņŚÛĽŔâģÉ",
		"darkPrismarine": "0g0g6<ĝZ/6YMQW*UYAŚH.ïW4Ĉa4Ĉ^xĩsxĩsd^ŃdwĻÂAJÂByKĊĩ0Ċ×CħÙčıcdĨÊdSőÂBiÂBy4Ĉ^ĈĈ^yĩsCĩsdħĻĈxÊÁByÁByĈĈ^4ĈRxĩ$xĩsdSŃeħĻÂByÂBy",
		"seaLantern": "0g0g_ÂDYÂnYÈ,ZÂnHÂDZÈDZÄDZÌEWÈ-WÄDY}nHßĢW÷šZðőZěÊYē$WĮéYĪÚHė;HěÊZûbHãġZ÷ŢWĮéHĺöZľĆWľąZĶöYJŢW}7HĶöZņĖWņĖHŊĖHłĆWĲöYPŞWė$WņĕZņąYĺöYğÊZė{YŎĖHŎĦHŊĖWŊĕZē;H^7HĮöYŊĦWÄEWŊĦHYËWņĕY^7WłąZłĖWłĖHJŢHĪËWĮÚHßġZ÷őZľöZĺąZYÚWPŞHãđZíıHðŁYė{HãĢWÂnZ}nY048wÎ01ag8KK>IiEÆĨċñùy]úNïSó6Uęà6cĂNÕĸěÔaî/ÝġŊ[ķxRXšzÕĵAcüĨČ9ûC{ā.Ś!kągĐĸśİýĔÈęNÑ6òt6]ĸśĲmxRęÏŋ6ÿĘcīĸśĲgĕÈïJÑCôXÓõĹkĲÀĎÈĸJŋCĂX2ČĸśĲmĉRęÏá6P0eüŘśİþ$ÈęĚÑ67,ÓPrñFûCÊāMŞ@ò(2ŔňàDķĉ=ëš3f_A/ŠŠmCöS*29Đ}ıĪ/6zĠęñnwĎ/JĹ01JúzÞ|Ŀ>ÛâwgöĪ^",
		"quartzBricks": "0g0g6ŚĦZŒöYŖĖHŖąZŊéWņÙY0000019ĞİAČüdJP%AąQJÉP+ń?Ğİ%J{dJPÙJ{dĜJAþńĚ_ÙþłÑ0S0TÀë%SJPķŀPÀāAħJPķPBÀJÙĻÉPÀJBķJPķłÚUûÚīÇĚÇAĞŀ%",
		"oakDoorBottom": "0g0g9ÖğYýĻWÒRZéîHĞ*WÀřHĎ4ZĢVZíFH1xj)xlUjÎ+Q@+Q@iÎÓhOhjMiÞÂyxÂyClÞxhmxhmjÞxh)xh)iÞxj)xj)iÞ+Q@+Q@*ÎÓÎOmÎOOÞÂyxNyCiìxhmxhmi1xh)xh)lÎxj)xj)jÎ+Q@+Q@NàMÓjMÓjNBVVVVVVV",
		"oakDoorTop": "0g0gbĢVZĎ4ZýĻWÒRZÀřH000íFHĞ*WéîHÚĞZÖğY1g0100g2iyyyyyyz2>ON>ONz2*VÁ*VÁAÏ*VÅ*VÅEJ*VÁ*VÁziìGhìGhz2>ON>ONA2*VÁ*VÁEi*VÅ*VÅz2*VÁ*VÁz2ìGhìGhA2hiIhiIE2>ON>ONziNyxNC×zÕ-Iì-ó]X",
		"warpedDoorBottom": "0g0gb]ŜW/8WyŀZCĂZtVWFĭHCÖH%âWgŊH/-ZËÓY1z?ÔV]IáJVÓGhU?kBV[nāUÇüBhTnāUÇÿxā?ÅāUÁnMāTnhUylMlPÿhßVMýOPÿVAá[NlBnÅ)VllGBVGÑÁlďVRBãQß,5VQ>ÑáBàúh[áâU,V.hTllÐâk.āTlmUÁkU??Q?ááQ",
		"warpedDoorTop": "0g0gcyŀZCĂZ/8WtVWFĭHCÖH/-Z%âWËÓY]ŜWt4WgŊH0gg11102iyNy4>ÂAg4)TQ>?gÔÞVnRzà,í[Å[R>yzJAk>y>ÓÐÏwNzÓ>ÓÑw4+ÔÓzÏwÑ[+ÑÏzÞ7nQ+Ñy>ná4y+ÏS3á?2yNAlSQU2Ó+K[à1>ÏÓ+KGO,àßÓNxáĈÓċíÏN?QĞAğ",
		"endStone": "0g0g6ņĂHľÖHŖłHĭşYĶoYŞŒZ4XI}iĉAEÂùíg9n8?wRÝĊňa^üXĻTÁûÉ(!IÀħĉxoV]XIPİaĉnhČĠTÏNR]Rjïo]&wÁA2RÑüĐ9ħhB4Ï}gSS#zwíýòÂŀwAb(yT5ħĄ",
		"ironTrapdoor": "0g0g8ĚĲWĢŒYĪcWĺ;ZľËH000ņéZŎĆH4üJPi]%ĞŃöĞŀ$ČċÒBp%ÉÐ×łp|ÉÐ×łq|Éà×łĂ|İĤ÷ÜŁÁĞŋúĞŉÁĞŋúĞŉ{ČČïBq|ÉÐ×łq%ÉÐ×łq%Éà×łā%ĴŢÛ|ŀ%ĞŃöĞŀ4JJPi]",
		"amethystBlock": "0g0g7ÒpZåØHöĔZı~WZ&HčŖWÊŐY5ibJĈÄ!ĈÁÅÏù8ëđna]5dI4ÄòFĄ0EkMÄy9ĕjëßÈ]Eg2!ëÖQĊg6ïÈwgĐAĒÀĿċÈBÄ÷5UÀ!ľÀ!ĢIlİÖ0ŃF5DëīùÈwĒ8$íŌħkPÞsÌ",
		"ancientDebrisSide": "0g0g7ÊĹZÒkW]ĚWSÞH(ÎWéïYþnZ4ĎüQíĨArēSùI0×|w0ëSù0ctđS4î÷Ĺ0Ï#ĞÝ0g}Â|ļwí}iPCAJ|ùTzÚĕęë9kJPÝŃ0SJ]Þrę]ùPÚëdÕiSŁĈ0I2&,U2ò09AXXÅÙò",
		"ancientDebrisTop": "0g0g7SÞHéïYþnZÒkW]ĚW(ÎWÊĹZ0ČôíõęčbÕÒAàEĚČ2ķûıĸi&.2ěS5ĈĢ×ĢnÈ(qĒġöÀ6Ăìgļ|aĐXìVsCĒKx2%0×ĈUħÂÔ]čVŁ40ÈÒÅÙı?<÷EìÚĈ]ļoüúÙÀðdÓÉïkT",
		"netheriteBlock": "0g0ga;ĪW(ĊYAÞZPkYÇVY|AZ-ŊYT4W|4W$ĊY1000010ijQQQQ?QÂ4Ð*VàIOÂ4àIV*ÆãÂ4,ïïVÃÝN4àä*?VÝM4GàVUO+N4,ÒVV,+Â4*VÃ*àãM4V?GàG+MlVïGGÓ0Â4ÆÆ+ÔÓ9ÂlÐOãÔKāÂlKÓKāāùÁlO*V*VVNiyxiyhyy",
		"copperOre": "0g0ge÷-ZéŞZâľHÖĎY.ĽWËâZňīZĨüHĊóWí5Yř6Y.čYÈÆW}ŐY00g1zyhxhxyhhjNhiQ*ÃOCÝyh2U?(gìxyBPÔùhyhg.ãĐ2BÃwxh8ëzÇýxzBÃxrĴĮM0)ýM0Ĥþßsńİgi4I1w{ëlMgìih8j,Ãh1yiy)þďzzM0PëP]1)ĹgI18ëh0ghiighhg1",
		"copperBlock": "0g0g8ŉ6ZļŌYİļHĨČZčÑWęXHā>YúzW0g]02Ą9+ú4þŕ8UIAęÛeŋT?ģėdy^|İÍ9iÂÛÕŖ8íûà[Ü4kăĂ,Å0ČœĸĢÿ5DÙöĜ÷9:ÒÚČ@9łØâyecÇÉđhÅmőŔ]ăćjÅ×QüŅ/ÚŞJÚŝ",
		"cutCopper": "0g0g6ŉ6ZļŌYčÑWęXHİļHā>Y42a4ëR&1tFIńg8ýc@ĂgQči)Ōe*2Mč5%Ď2dĐ2%-B%SyÄļÚVÉV0íR4ë^Mğ2(8Ĺd-yw@J9Ĩly)ą&0ąMĜĩ(6ŌdĎ5w,y%-Bđ#VP#Â",
		"exposedCopper": "0g0g8ĵ-WĢ7HýĽWđĽWĂ+YéĬHåýHæÓY0g]02^dįňÛpÛg=^ÑħŕhĿÂOĮÌeãāJAōdĭ_ÚUÒdNÉ×ċd9OrViÌ9ĀĺĒäŅcĭĂÂRĴeQłÑğljįł%ĠBk/ŊÙħōlľxÑĮĖaŐcMBÚ+łĖĞłĕ",
		"exposedCutCopper": "0g0g8ĵ-WĢ7HéĬHĂ+YýĽWđĽWÞïWæÓY42^42ıMăm!OCsĿĊgĀĊeļ&mĬ&m?È6ÇÌ&]æ+ıæLıťMÂő_BĞÇÚþ0íR0g^mÆ^hămM^ÏLŀÄaÃmuĲCNĀĊe?ÏáăÓM!Ûœł!FÅıİ%þŀ%J",
		"weatheredCopper": "0g0g8æŀYÓďHÓñHÛVZ÷nWã*HÖīHPĭH0g]02Ą9+PÀþŕ8Â^ùęÛeŋRïłėmJa|łÍ9iÂÚ#L8JJÖ.L4üăPġÍ0Čŋ|Aņ5DzQíĆ9ĎłÑAÌ9Ļû?AĵcÈĉÂxÅmŋ^úrćmĻÂúüŅ/ŔŞZŔŝ",
		"weatheredCutCopper": "0g0g8æŀYÓďHÖīHã*H÷nWÛVZÓñHPĭH02a40R%İGi.De_ğhŀ!qĴğfÅ,rÈő:Ôğ:Ôqr|Ě,ÖD+įřÍŜZËHľ0íR40^O.y+ÚĚdĥ!NÖßlŔćNĿŞmœņ+Ğő:ËvnÅv/ġyOÖDŐLľPLĹ",
		"oxidizedCopper": "0g0g8ÜpZÈİW}đWÂñY=6Y}ÆH.ĝY.ýH0g802Ą4üŔAĎŕ4ÂĒEęÛ6ĩÇFģv9ĜÁ|ÄņdĎPBĎć5ĊPB)Ŗ5kò|čÍ4üú%iņ5ióAċÌ9ĊúB/ĆdĜİ{Łĵ$ÄĸVMÅ+ĮÇâăn9Å×Ğüþ:ÚŞZŔŝ",
		"oxidizedCutCopper": "0g0g8ÜpZÈİW<ōHÂĀY}ÆH*ýWÂñYÌĐW42a0ùRdġBe]ŌdŖBdĴšfHtf,ńrèŁ:,ĝ/ÓŁhĥy&@ŌN.yÄļÚVÉV0íR02aq{ŉi|qeèŉqÚŁdŝń%Ŗń.œń%ĤřpŐąhŔBMİNNÖBđ#VP#Â",
		"deepslate": "0g0g5åŎYÒþHÁ?W;śW$ěH5AăAČĹ}@ł?CĺAiüJ,rÕČłQ2^öCŁAíÃ1kĊBkú4črPġqFĞįB-Ĺ|+ķEĎŁÛQúPďzEĎûß)ëBN0|+ìFĜ9FĞòÚįò}.r0üŃKČ]0ĊüSüò",
		"deepslateTop": "0g0g5ÒþHÇÒYPBWâľH;śW5yS1čgiAôdħňQñi^6ŋúhxw0ňÝEóúgëÝ0P]Ċ3ÂRú!QòdIJ0,1xĠaA78düÂQĐú1Č>Igr@S3ú2ĪIýA]JüÀðsxñhQ0ŃA,0AđyBiÂ",
		"cobbledDeepslate": "0g0g6PAZ)ĺYÖĎY;śHåŎYÇÒY0ĎqùÀĕcķĳTðĐAĞ^cěÉÏ#?5JĲúÀbÑăwV0įę9#U+^íĜ3cþÈĈq1úM?cmŀÄĘ%ÎJÚSmoeī5ĉJ_Û0SĔ+U÷ë>ÒóŌSiŀÑ]ļknSčı]Ùły",
		"polishedDeepslate": "0g0g7ÚĞZÇÒY$ĚZP)ZT4W-ĺHAJH00S42a4ÿ#AþŁ4ġjÑJÈhğAĝUĖcþİAĚÏlFzCBmNÆŃöĞŉBĭPCiÏe@ŀ&JŁl#AđÇmhJPýJŅii_úJŁaıĒĞ]JAJŋÑJÈcJĹÙJ}FÑĞĲÒĞ",
		"deepslateBricks": "0g0g7ÇÒYÚĞZT4WAJHP)Z-ĺH$ĚZ4JPAùjw00ë0ēw1w08û!8ùi5j)!ĊúFÃiļÂóčàĞłÚğÉēŀĥăçÓŅA2>4JP20ēw10i1jw40iS#y8ëýE#h10ĞČēaIĊĞłØĞłÚłÚăÜÚĞ",
		"crackedDeepslateBricks": "0g0g8ÇÒYÚĞZP)ZT4W-ĺH$ĚZAJHoÎY4ĊPAñ&wS0S0ŕw8ùJ8Ņ%5A9@Ć(;ĺPĥuaÔuĶÔĖJÖ$ĂİĎğçYťńŜA>nÀJì1(ōX0ă×IĆw40lxCRĜħVĜ&ýóëĂ+ōe5ÃĂİCJPAģÉãŁłÚ",
		"deepslateTiles": "0g0g6$ĚZAJHT4W-ĺHÇÒYP)Z0ù90J1Pā$JVÀÙpÚPAĿKp×đAĀ0qJÚĞŀAù1wgPJĲ×%ðĿĝUăc0oĒČădĘ1wg0w2PdîÑĚ^û$3ÂPAĿw2J|ĞħAù10ù9ÖAùÚíûP+ĿÙ2ă",
		"crackedDeepslateTiles": "0g0g6$ĚZAJHT4W-ĺHÇÒYP)Z4ù9wJ19ā$únÀKpÚ]AĿÑr×ĉAĀ0ùĹÒĞŀAJ1AgPJıĀ%íĿĝUŀc2oÄĎĨdĘTwg0w2PdîÑę^û$jÂ]AĿw2J|þħAù10ù9ÕAĀÑNûT+ħxĘă",
		"deepslateCoalOre": "0g0g9åŎYÒþHÁ?W;śW$ěH8wYEĊYsÞZPzZ1yyOhizyzQOQTyOzh1iÄÑ>ãONiDÓñÀhi?ÏMnV0hz0hyT0ARx1iQ>yÔÑNiOÄáhCëyzBÕÔig2NOTã0yN)>ii0z)>?Kh)QhzQM1iÆÒÁiðÂhOmÀ1zÒ4O0g3ÔM0xg0iiAwhyh",
		"deepslateCopperOre": "0g0gdåŎYÒþHÁ?W;śW$ěH.ĽWňīZĨüHí5Yř6Y.čYÈÆW}ŐY1yyOhizyzQOOxA>zkV3QO@ÝONgBÃx01i>yÆÔìghz0Eãùh)>x1i03z]XNi)>gqĤğyz?îwiēðÝ:ĳĠ1y*03iÉ0z)Sygh0g7zzN1iOBðÿONhOÆRÆÀ>?Ī0hz(1iw00iiAwhyh",
		"deepslateDiamondOre": "0g0gcåŎYÒþHÁ?W;śW$ěHM4Wv|HGąWm.WÓEZľZHÎŎH1yyOhizyzQÃOxyOzh1ÏBU>äûNiû,ò0āi>yO.úghz0x!ßhďĚx1ĂãÕĚÕüNiÇăăVă>yDØOVďiON:ĜyDÕô)>iiÏzġýÂ0hzg0BÅí1i*ÀhæãÕęOğòhEÖăO0pû):Jxg0iiAwhyh",
		"deepslateEmeraldOre": "0g0gcåŎYÒþHÁ?W;śW$ěHłťYnãW1ňY*ÐZ>įHuÏYnkH1yyOhizyzQOOxQOzkÄiAQÄ)ONÔ3OxÔ1i>0kíh0hz0zPĂhxyx1oýæíOQNj]ÿēìz?Ï*ÐĢ0ii+Ý+Ý0xA>(1g2NzPĀM0hzg0åÅĊ1iOQhçæĚhO)ÄhEĈ4O0hÔ4(2xg0i0Awhyh",
		"deepslateGoldOre": "0g0g9åŎYÒþHÁ?W;śW$ěHąJWőÝZZĜYZŢH1yyNhizyzQÀzxy)>h12?Q>?ÃNiAÄÁ0ÄÂ>y*ÔÁgÓ30xÔäÎx0x1i6ãÂOQNiO(K1zCÀzÄzÀii(1OÔ21yQM>i0hz)VÏ0hQ(3BÓñÁkVKlgÔÝ1*ÔñgzÄ1O0mÝ)(0yK0g2Awhy1",
		"deepslateIronOre": "0g0gaåŎYÒþHÁ?W;śW$ěHâüZòļHĖ,HŁġWŊaY1yyOhizyzQOOxÄÒzhÔÐQ>6ÝO+ä2zxg1i>0O+Ôãhz0xÔIĀÝCÞ1i0äë3QNiOO01z>yzCàwlÔÃNOÅäìyä4>igò3)0y0hz00zBÏ1iOÔ1ÄäñÎ+á0hDòÝ30Òz)M01gh0iAxhyh",
		"deepslateLapisOre": "0g0gdåŎYÒþHÁ?W;śW$ěHpÉZxÕYloZgłZhqZ?ĥZ×ÍHgŀZ1yyOhizyz>QOxy>zhÄÅA)>ñ3N1p7Ĉg0i>y((1hhz0z*úhÕyx1-ēďyē1Npĉ00h0jy!ĚOFlGkN(0ypÈďp>giJwóĘ!Khèħ1w1rĉi(chæĊoĈO)ēÁēëw30hÈÝw2xg0ig2(hyh",
		"deepslateRedstoneOre": "0g0ggåŎYÒþHÁ?W;śW$ěH{ĺH-ĚZügHįgHţ0WŤâZīgHü0WťEYïÒYśÞZ1yyOhizyzQOOxyOzh1lÄQ>)ONlÅGÎ0hi>EäĂĤghz0xġŀňxøň1i&ŕyOŕNlÄOghV>yÍďÐwnñóř,ťyxy/ņŊuŉNz)>ŕ0hCVKzzN1iÔşŞi-řhO=ĕhz>QO0hŕ)(ixg0iiAwhyh",
		"netherGoldOre": "0g0gcÀÁHUíWÀÎYÑĊYÝĪWSÁHę1HšĚYï4WZĜYZŢHĬúZ12NQOÃ)MjMBzR5Ow>>Ó2MÝN)X.ďk)ă3z][û]îQAM4MĜIQ:O>3RU)>!üXT5z>ç_àIN)NCOQ()zPċÂ))S2k)àÂ]QCÂ+ANbA(Ôi3>A/J4)(k)]Pçj]SzQîxC))Oy)R)lzQO",
		"soulSoil": "0g0g5ÇjY]ĹZ;ĚH)ĊWÖQH4Č^ÖgABNj|24FĘjÕû8PwÉQù1|ùİA2aÖ0]0ë^]20ùiÃwù8ëüúF1wAČP]91Fwag]9]íJJ2óSmķgiJ0Ďõëüŀ1+Qìmĸ5)KXĎòFĊ4",
		"blackstone": "0g0g6(ěHAìZwTZkMW;ŋH|BH4ČĩÑSÀwgi0]qÕJú2]ÃQ0ÀJÂôwPamüôJ^9^CÉiķıEĞh0Ďį4Iú0ČQ9ČÁByú|gaS4ŁNP3ySÃyĿ92]aE2úJÀŀF4ùþXŁÒkõACŀ{J]",
		"blackstoneTop": "0g0g5AìZ(ěH;ŋHsTYkMW5yÆEëÑòirKñaIĈa%ĚìKI^TČÀ2]iik_0xpJR>ÎyõÎįrÒk_]8İ0ĉ2AĀa2+2QòrÂ2I]-ĨQiJiNíÀč1e4ùÎyoÛ2IÑĈTQSSxĚTP]õ",
		"polishedBlackstone": "0g0g6|BH;ŋH(ěHkMWAìZsTY0ë840^5ih]ĊûEiJIíV1iúFkÒ0ĐĊEĐĊ82^IíÂBiúFkÏx2U4ĬB0XÑB?bBk9ÂAö4iÏüĀ{8ĊúÀđU5AóM^ý8ăiFq|EĐČþČUÂP$JP$",
		"gildedBlackstone": "0g0ga(ěHAìZwTZkMW;ŋHQKWŁSZégZZĜY|BH1iz2M45ÀgÔÀy04SÂ+hix6XTzÞ01wQäijg4Qi9úßlQQùhyRÁ*4ā3lijÀx0i*Ý1gRx0ix42ÔÁxhyixBx0lxgãN4QQ7gQ1î0āSm0QSÏi0iÞQP3,iwBÀPùz*Mxykh2OMzhÁg",
		"basaltSide": "0g0g5|AZoûW-ŋYËâZ(ĪZ50ĪÙ(wðSĪÙ(iN0łÙ(ëA6łc-ëQ(ĩ1waÂ+icxaJ)ķÙxgùQëÎĨ2ë(ĀÚĩëë6rÚĠăù6rdírù+rTĚs0+2ìXkëQgëwĹì6ăgAħ46rÎXo",
		"basaltTop": "0g0g7ËâZâľH|AZ)ĻWóEY;śZoûW0üÉA636mĹKÈŁč+ëeĪÀ{qì{ĀqĭhSÙJ&ħìØ5ìSĿdĀ0Ģý%ŋĐ4Ĥđ1Č5DÙįĞĈ?ġJħSKocëÈ0ĄĨwëO4ăTPëŝī(×~Ó6ĴëeÑĘ]Kwe(wS",
		"polishedBasaltSide": "0g0g6(ĪZ-ŋY|AZâľHËâZoûW5.júF8č-ĺ÷B9č-Ŋ÷*99+łöġ95@ŊöĠúB]ŊöĠú5QłòįI1AłÖįIĉ)ŊÞĎIĉ)ŊÚĭöĊ-ŊÚįï6]ŊÚĠïa-ĺÛ)I!-ĺÛ-ù!-ĺ÷-ù!.j÷Ph",
		"polishedBasaltTop": "0g0g7(ĪZ;śZâľH|AZ)ĻWËâZóEY5Cŋ^ĠįańØĽďÇ#$ýİÒÚâ/ŔÚĞû+ĥĞPCŀ.ËËĖĎĕ*ĤřİēĝÉ;ŚĒĎĕĞĜŜÖŎû#*ÂPŒĚâ*ËÛōĕĝ)JÉÓúÖÄńâğû,ÑŜÈĻúFÒÂÈĒđ6ēÈ^ĢI",
		"shroomlight": "0g0g8ļSYĜĘYŌħHťjYťĞZZåZZnZZłH4wŁ4ĲÆFAAÕØOdİĜìġĜ9ĲÛó[zRÍOjÕŉaÇoăŢqcdĈăŠq×ķûqįċßŎÛØÓAØ[èİìz|<Čĵ]JÚÑĞòÉK×Őj2Íir]Ğí@ķ})ĜÎAì]AgAw9",
		"crimsonPlanks": "0g0g7èŌHÕĻYXŜY]ûHÊīWQîW;ßZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"crimsonStem": "0g0g8QîWÀÎWĘJH]ûHä0WüÁHI(ZUěZ0ĎňČMI0ķňčě8/iĵĪíÞTĩ1ĮĠÚLĀÇïŚđvĀç(ĘÞOŚvōjôĶě3ţįÉħgÎdĀW)ÓĳX]ç!úş(ĩĿčíZis1Ĵĩv(óT$Ŋ3īN÷7h8)ĞÖ2þw!úI",
		"crimsonStemTop": "0g0gbQîWÀÎWä0W]ûHüÎYĔíWXŜYèŌHú6WÊīWÕĻY0iOTÁ34gmÓÔÔñãÓÎ@OāđĒĒāX6-ðÓÔÓÖK,þGGGG×à6ĎåĂđÿÖÝnÿàGGÿåÎÅĎåæďď×ânĎåæÿÿÖÞ[ĎåGGďåá,þåûĂď×à,ĎGGGGÖàCĎÔÓÓÕÖßmđđāāāāÎ6ÓGÔäGÓK0iOTÁ34g",
		"warpedPlanks": "0g0g7/8WFĭH/-ZtVW%âWt4WgŊH4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"warpedStem": "0g0g8QîWQĝZmÄZ]ûHlïYi6HhĞYUěZ0ĎňČMI0ķňčě8/iĵĪíÞTĩ1ĮĠÚLĀÇïŚđvĀç(ĘÞOŚvōjôĶě3ţįÉħgÎdĀW)ÓĳX]ç!úş(ĩĿčíZis1Ĵĩv(óT$Ŋ3īN÷7h8)ĞÖ2þw!úI",
		"warpedStemTop": "0g0gcQîWQĝZlïY]ûHlşHiÕH/-Z/8W+åWtVW%âWFĭH0iOTÁ34gmÓÔÔñãÓÎ@āĒĢģģĒX6ĀðÓÔÓ×K,ĎGGGGØà6ĞæēĢď×ÝnďåGGďæÎÅĞæçğğØânĞæçďď×Þ[ĞæGGğæá,ĎæđēğØà,ĞGGGG×àCĞÔÓÓÕ×ßmĢĢĒĒĒĒÎ6ÓGÔäGÓK0iOTÁ34g",
		"poppy": "0g0g9000œĩZĀìYĤJYáëWxiHBÏH^NYFĩY00000000000000000000000000000000000000000000i000000jx(00001)Mw00001hi000000*K0000000Ý0000000Ý0000000Ý000005KëÓ00000ÀV0000005Ò000",
		"cornflower": "0g0gb000ßWW?ĖYÏeYF;HSġY%ĊHöĤWÄ)ZÈâW<ŊH000000000000000000000000000000000011z00000xiNw00003QÂS000006Ý0000008ë0000000K00000ë0ë0000080ù00000aëù000000Đù0000006ù0000000K000",
		"dandelion": "0g0g8000ZĜZZÃYřßHĥĊWlŗH^NYÄĊZ000000000000000000000000000000000000000000001w0000aÑ0000ÇIë000cQ00005Ĉ0001Għ0000LŁë0007Ĝ00006Ĉ00",
		"jackOLantern": "0g0gaĬĸHčìWĉKYŉTZŉüYZ6HZïHZšWĽċHèŗZ0102g0i2O(3(j(jN4SV43Ã3RzSÄU5V(Sz*ÓÐ5ÓÀ(z*Ôà5GKOz*ÔÝlGÕOz)G(kÔã>zO>43Q)Oz**3À5*OzVVâÅVÒOzÄÔGGGÓÐw*ÐÔ7Ó6ëw)Oîz-ûNJ90ywyJ9JFwyJFJF",
		"lantern": "0g0gc000<lWP@Hò>Wì2WAěZĨíWřQYŢCHZŤHZşYTBZ1yg000003Q(002h0iyx00150@GÑ00150,Ià005l0-Ăî00000-đî00150[Iá005l0iyx00000hģh00000ryę002h0Ěy#00150Ěy#00000ryę00000hģh0000000000000",
		"carvedPumpkin": "0g0g8ĬĸHĉKYčìWŉTZŉüY$0WQSWèŗZ0g1S4TÚùĿ%íŀirQyĚx&#Ĕ+ķK%ńě,×Æ%ńě,ÙÉ%ńĘ,Úă%ĴĀOÚċ%Ġīe[r%ĺ>ĈÃÉ&łâĢńÉ&ŔĞłÚěxń+rÎĘxĽŚ%ŕŀŋÝ9wĆ[ŋř9ŋť~",
		"pumpkinSide": "0g0g6ĬęHĉÀYđìWŉxZŉüYèŗZ0g1S4TÚùĿ%íŀßlzNRx&zA&SK%íł%ĞÆ%íł%ĞÉ%Ěł%ĞÉ%Ěł%ĘÉ%Ěł%ĘÉ%ĚłĕĚr%íĿĕĚł%óĿĕĚłxóħĕóħxķ0Ĉa1ČÂ9Ĉq?ČĹPČŁ|",
		"pumpkinTop": "0g0g8ĬęHđìWŉxZŉüYĉÀYŉĈWĞgWKķH0gëw211yJFyI9AjdĈg0)ÂEmò9l0ëXg9đGùyĀPĉĖŉgĀ8İŜĘ4ìxx=Ņ]Àdo7ŗ4J{ČwíyÀ8ASxQ85ĊJF2IxwĿPyú9mĸ9Ěhwgh10T",
		"cobweb": "0g0g4Į<W000ZZZŎĖYlVýUÒÃęÇÊïþÒÅÄlļUĀGÒÁãËËËrÔÁ=őļü?ÿė-Á}?ÿÇãÇąÅÔ^ÁUĺlĬÇÚÃĝÒÃĬÇlÇVU",
	}
}

// Compute texture coordinates so I can store them in blockData.textures.
const textures = Object.keys(texturesFunc())
const textureMap = {}
for (let i = 0; i < textures.length; i++) {
	const s = 1/16 // numberOfTexturesPerRowOfTheAtlas
	let texX = i & 15
	let texY = i >> 4
	let offsetX = texX * s
	let offsetY = texY * s

	textureMap[textures[i]] = new Float32Array([offsetX, offsetY, offsetX + s, offsetY, offsetX + s, offsetY + s, offsetX, offsetY + s])
}

class BlockData {
	id = 0
	name = ""
	textures = [new Float32Array()]
	transparent = false
	shadow = true
	lightLevel = 0
	solid = true
	icon = ""
	semiTrans = false
	hideInterior = false
	rotate = false
	flip = false
	iconImg = document.createElement("canvas")
	shape = shapes.cube
	uniqueShape = false

	constructor(data, id, hasIcon = true) {
		if (data instanceof BlockData) {
			const canvas = this.iconImg
			Object.assign(this, data)

			this.id = id
			if (!hasIcon) {
				this.iconImg = null
				this.icon = ""
			}
			else {
				canvas.width = 64
				canvas.height = 64
				this.iconImg = canvas
			}
			return
		}
		if (data.shape) this.uniqueShape = true
		this.iconImg.width = 64
		this.iconImg.height = 64
		this.id = id
		blockIds[data.name] = id

		if ( !("textures" in data) ) {
			data.textures = new Array(6).fill(data.name)
		}
		else if (typeof data.textures === "string") {
			data.textures = new Array(6).fill(data.textures)
		}
		else {
			const { textures } = data

			if (textures.length === 3) {
				textures[3] = textures[2]
				textures[4] = textures[2]
				textures[5] = textures[2]
			}
			else if (textures.length === 2) {
				// Top and bottom are the first texture, sides are the second.
				textures[2] = textures[1]
				textures[3] = textures[2]
				textures[4] = textures[2]
				textures[5] = textures[2]
				textures[1] = textures[0]
			}
		}
		for (let i = 0; i < 6; i++) {
			this.textures[i] = textureMap[data.textures[i]]
		}
		delete data.textures

		data.name = data.name.replace(/[A-Z]/g, " $&").replace(/./, c => c.toUpperCase())
		Object.assign(this, data)
	}
}

const blockData = [
	{ name: "air", textures: "air", transparent: true, shadow: false, solid: false },
	{ name: "grass", textures: ["dirt", "grassTop", "grassSide"] },
	{ name: "dirt" },
	{ name: "stone" },
	{ name: "bedrock" },
	{ name: "sand" },
	{ name: "gravel" },
	{ name: "leaves", transparent: true },
	{ name: "glass", transparent: true, shadow: false, hideInterior: true },
	{ name: "cobblestone" },
	{ name: "mossyCobblestone" },
	{ name: "stoneBricks" },
	{ name: "mossyStoneBricks" },
	{ name: "bricks" },
	{ name: "coalOre" },
	{ name: "ironOre" },
	{ name: "goldOre" },
	{ name: "diamondOre" },
	{ name: "redstoneOre" },
	{ name: "lapisOre" },
	{ name: "emeraldOre" },
	{ name: "coalBlock" },
	{ name: "ironBlock" },
	{ name: "goldBlock" },
	{ name: "diamondBlock" },
	{ name: "redstoneBlock" },
	{ name: "lapisBlock" },
	{ name: "emeraldBlock" },
	{ name: "oakPlanks" },
	{ name: "oakLog", textures: ["oakLogTop", "oakLog"] },
	{ name: "acaciaPlanks" },
	{ name: "acaciaLog", textures: ["acaciaLogTop", "acaciaLog"] },
	{ name: "birchPlanks" },
	{ name: "birchLog", textures: ["birchLogTop", "birchLog"] },
	{ name: "darkOakPlanks" },
	{ name: "darkOakLog", textures: ["darkOakLogTop", "darkOakLog"] },
	{ name: "junglePlanks" },
	{ name: "jungleLog", textures: ["jungleLogTop", "jungleLog"] },
	{ name: "sprucePlanks" },
	{ name: "spruceLog", textures: ["spruceLogTop", "spruceLog"] },
	{ name: "whiteWool" },
	{ name: "orangeWool" },
	{ name: "magentaWool" },
	{ name: "lightBlueWool" },
	{ name: "yellowWool" },
	{ name: "limeWool" },
	{ name: "pinkWool" },
	{ name: "grayWool" },
	{ name: "lightGrayWool" },
	{ name: "cyanWool" },
	{ name: "purpleWool" },
	{ name: "blueWool" },
	{ name: "brownWool" },
	{ name: "greenWool" },
	{ name: "redWool" },
	{ name: "blackWool" },
	{ name: "whiteConcrete" },
	{ name: "orangeConcrete" },
	{ name: "magentaConcrete" },
	{ name: "lightBlueConcrete" },
	{ name: "yellowConcrete" },
	{ name: "limeConcrete" },
	{ name: "pinkConcrete" },
	{ name: "grayConcrete" },
	{ name: "lightGrayConcrete" },
	{ name: "cyanConcrete" },
	{ name: "purpleConcrete" },
	{ name: "blueConcrete" },
	{ name: "brownConcrete" },
	{ name: "greenConcrete" },
	{ name: "redConcrete" },
	{ name: "blackConcrete" },
	{ name: "bookshelf", textures: ["oakPlanks", "bookshelf"] },
	{ name: "netherrack" },
	{ name: "soulSand" },
	{ name: "glowstone", lightLevel: 15 },
	{ name: "netherWartBlock" },
	{ name: "netherBricks" },
	{ name: "redNetherBricks" },
	{ name: "netherQuartzOre" },
	{ name: "quartzBlock", textures: ["quartzBlockBottom", "quartzBlockTop", "quartzBlockSide"] },
	{ name: "quartzPillar", textures: ["quartzPillarTop", "quartzPillar"] },
	{ name: "chiseledQuartzBlock", textures: ["chiseledQuartzBlock", "chiseledQuartzBlockTop"] },
	{ name: "chiseledStoneBricks" },
	{ name: "smoothStone" },
	{ name: "andesite" },
	{ name: "polishedAndesite" },
	{ name: "diorite" },
	{ name: "polishedDiorite" },
	{ name: "granite" },
	{ name: "polishedGranite" },
	{ name: "light", lightLevel: 15, solid: false, transparent: true, shadow: false, semiTrans: true, icon: "lightIcon", hideInterior: true },
	{ name: "water", textures: "waterStill", semiTrans: true, transparent: true, solid: false, shadow: true, hideInterior: true },
	{ name: "lava", textures: "lavaStill", solid: false, lightLevel: 15 },
	{ name: "obsidian" },
	{ name: "cryingObsidian", lightLevel: 10 },
	{ name: "endStone" },
	{ name: "endStoneBricks" },
	{ name: "chiseledNetherBricks" },
	{ name: "crackedNetherBricks" },
	{ name: "crackedPolishedBlackstoneBricks" },
	{ name: "crackedStoneBricks" },
	{ name: "polishedBlackstoneBricks" },
	{ name: "prismarineBricks" },
	{ name: "quartzBricks" },
	{ name: "oakDoorTop", solid: false, transparent: true, icon: "oakDoorTop", shape: shapes.door },
	{ name: "oakDoorBottom", solid: false, transparent: true, icon: "oakDoorBottom", shape: shapes.door },
	{ name: "warpedDoorTop", solid: false, transparent: true, icon: "warpedDoorTop", shape: shapes.door },
	{ name: "warpedDoorBottom", solid: false, transparent: true, icon: "warpedDoorBottom", shape: shapes.door },
	{ name: "ironTrapdoor", solid: false, transparent: true, shape: shapes.cube },
	{ name: "cherryPlanks" },
	{ name: "cherryLog", textures: ["cherryLogTop", "cherryLog"] },
	{ name: "copperOre" },
	{ name: "copperBlock" },
	{ name: "cutCopper" },
	{ name: "exposedCopper" },
	{ name: "exposedCutCopper" },
	{ name: "weatheredCopper" },
	{ name: "weatheredCutCopper" },
	{ name: "oxidizedCopper" },
	{ name: "oxidizedCutCopper" },
	{ name: "prismarine" },
	{ name: "darkPrismarine" },
	{ name: "seaLantern", lightLevel: 15, shadow: false },
	{ name: "netherGoldOre" },
	{ name: "ancientDebris", textures: ["ancientDebrisTop", "ancientDebrisSide"] },
	{ name: "netheriteBlock" },
	{ name: "soulSoil" },
	{ name: "blackstone", textures: ["blackstoneTop", "blackstone"] },
	{ name: "polishedBlackstone" },
	{ name: "gildedBlackstone" },
	{ name: "basalt", textures: ["basaltTop", "basaltSide"] },
	{ name: "polishedBasalt", textures: ["polishedBasaltTop", "polishedBasaltSide"] },
	{ name: "shroomlight", lightLevel: 15 },
	{ name: "crimsonPlanks" },
	{ name: "crimsonStem", textures: ["crimsonStemTop", "crimsonStem"] },
	{ name: "warpedPlanks" },
	{ name: "warpedStem", textures: ["warpedStemTop", "warpedStem"] },
	{ name: "amethystBlock" },
	{ name: "deepslate", textures: ["deepslateTop", "deepslate"] },
	{ name: "cobbledDeepslate" },
	{ name: "polishedDeepslate" },
	{ name: "deepslateBricks" },
	{ name: "crackedDeepslateBricks" },
	{ name: "deepslateTiles" },
	{ name: "crackedDeepslateTiles" },
	{ name: "deepslateCoalOre" },
	{ name: "deepslateCopperOre" },
	{ name: "deepslateDiamondOre" },
	{ name: "deepslateEmeraldOre" },
	{ name: "deepslateGoldOre" },
	{ name: "deepslateIronOre" },
	{ name: "deepslateLapisOre" },
	{ name: "deepslateRedstoneOre" },
	{
		name: "poppy",
		textures: ["air", "poppy"],
		solid: false,
		transparent: true,
		shadow: false,
		icon: "poppy",
		shape: shapes.flower
	},
	{
		name: "cornflower",
		textures: ["air", "cornflower"],
		solid: false,
		transparent: true,
		shadow: false,
		icon: "cornflower",
		shape: shapes.flower
	},
	{
		name: "dandelion",
		textures: ["air", "dandelion"],
		solid: false,
		transparent: true,
		shadow: false,
		icon: "dandelion",
		shape: shapes.flower
	},
	{
		name: "cobweb",
		textures: ["air", "cobweb"],
		solid: false,
		transparent: true,
		icon: "cobweb",
		shape: shapes.flower
	},
	{ name: "pumpkin", textures: ["pumpkinTop", "pumpkinSide"] },
	{ name: "carvedPumpkin", textures: ["pumpkinTop", "pumpkinTop", "pumpkinSide", "pumpkinSide", "pumpkinSide", "carvedPumpkin"], rotate: true, shape: shapes.cube },
	{
		name: "jackOLantern",
		textures: ["pumpkinTop", "pumpkinTop", "pumpkinSide", "pumpkinSide", "pumpkinSide", "jackOLantern"],
		shadow: "false",
		lightLevel: 15,
		rotate: true,
		shape: shapes.cube
	},
	{
		name: "lantern",
		solid: false,
		transparent: true,
		shadow: false,
		lightLevel: 15,
		shape: shapes.lantern
	},
	{
		name: "oakFence",
		textures: "oakPlanks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	{
		name: "acaciaFence",
		textures: "acaciaPlanks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	{
		name: "birchFence",
		textures: "birchPlanks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	{
		name: "darkOakFence",
		textures: "darkOakPlanks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	{
		name: "jungleFence",
		textures: "junglePlanks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	{
		name: "spruceFence",
		textures: "sprucePlanks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	{
		name: "cherryFence",
		textures: "cherryPlanks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	{
		name: "netherBrickFence",
		textures: "netherBricks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	{
		name: "crimsonFence",
		textures: "crimsonPlanks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	{
		name: "warpedFence",
		textures: "warpedPlanks",
		transparent: true,
		shadow: false,
		shape: shapes.fence
	},
	// Removed because everyone wants them to explode, but they don't explode.
	/* {
 	name: "tnt",
 	textures: ["tntBottom", "tntTop", "tntSide"]
	},*/
].map((data, i) => new BlockData(data, i))
blockData[0].iconImg = null // Air doesn't need an icon.

const BLOCK_COUNT = blockData.length

let Block = {
	top: 0x4,
	bottom: 0x8,
	north: 0x20,
	south: 0x10,
	east: 0x2,
	west: 0x1,
}

export { texturesFunc, blockData, BLOCK_COUNT, blockIds, Block, BlockData }