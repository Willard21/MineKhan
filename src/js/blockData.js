const texturesFunc = function (setPixel, getPixels) {
	return {
		grassTop: n => {
			for (let x = 0; x < 16; ++x) {
				for (let y = 0; y < 16; ++y) {
					const d = Math.random() * 0.25 + 0.65

					const r = 0x54 * d
					const g = 0xa0 * d
					const b = 0x48 * d

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
					const r = 0x54 * d
					const g = 0xa0 * d
					const b = 0x48 * d
					setPixel(n, x, y, r, g, b)
				}
			}
		},
		leaves: n => {
			const { floor, random } = Math;

			for (let x = 0; x < 16; ++x) {
				for (let y = 0; y < 16; ++y) {
					const r = 0
					const g = floor(random() * 30 + 100)
					const b = floor(random() * 30)
					const a = random() < 0.35 ? 0x0 : 0xff

					setPixel(n, x, y, r, g, b, a)
				}
			}
		},
		hitbox: "0g0g100W",  // Black
		nothing: "0g0g1000", // Transparent black
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
		"coalOre": "0g0g7÷-ZéŞZâľHÖĎY;ŚZ)ĺH?kH4íú|y0Bm04ĞıFĠôÖp90g{ČiiQČŁ5gòwÿĉ#QķQŐB6ÂP|J0ÚČ0igÃķĊRAmUĞù1ÒoăS+ÂAJ0d^1F+2ĂP^0ıPmüPFg1wkúAJÀAJS",
		"cobblestone": "0g0g6ÚĞZÎðWĎĂHÁ?WĞłHóoY5C^óăl!ÈŋÄě?!ĈVĐmÕCíÕĈļ_KĿöCAđì_TãĬ?UļÕA!cĜbTęh|6wdþĹÆMÁSĜîÁĊó_wmüĈi$QģBmwÏĐr?MÈVmíÕ^ó8ĜlP)úT4ĿĐ",
		"cyanConcrete": "0g0g3lĿYlŏYlĿH1IÀpE?SmkÀw6PÁB?S4k299úkÄRPÒÎwĊ?A2ÑIĀ8püUiSÒgý95Eòak?ý?1RÀFÀKSÒù",
		"cyanWool": "0g0gelşYm8ZmFWmPHlşZm.WlŏYmÖZmÇHmoZlĿYmÇYmÖYm.H10zTÃKy6BGîā6pĎpôāĲF:ńĮ*x:ú#PģxçÇROÓimO6Ó_@1@pÎ1GîyJñÇGNhG*ģ1:Vģ<ÎĝTpmF6poÓý?GąGģOç*ĠJÂ24Vh<4lÓlhÓĤÓz%GÄļĮěFÖłāğĳFĚÃäh%gÑĚ1ĤúÉ4ô",
		"darkOakLog": "0g0g6;ĨZ(úW]ňZEìW(úHÇiY50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"darkOakLogTop": "0g0gb;ĨZ)ĉYAÞWsKZ{ĨY]ęHÀňY(ÝZ-úW;ĉW(úH1xizNj1g4Q??ÒUQTAGIĀāāIÏkãÑQ?Q]>čXVVVVPÂ)üÆòĀï]Á*ïÅVVïÆTBüÆÇýýPÀ5üÆÇïï]À5üÆVVýÆÁlXÆñòýPÂBüVVVV]Â)ü?QQ@]Ã)ĀĀIIII>ČQV?ÄVQTgNxg0iz(",
		"darkOakPlanks": "0g0g7{ĨY]ęHÀňY-úW;ĉW(ÝZEKZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"diamondBlock": "0g0g9_ĦHW÷HncHľZHZZZćťYÔŅWàŖWeŒZ00h01hg23QVO*ÄÐN4ÓàVKh7N4Ô*ÅK0GÂlâVã0ÔãÂlVÅK6VKo3VGãÒÄ1o3ÅGÓGK18lGãÔãK0ÏlGÓGÓÓ7ÏmãÒÄÓÓÅ8gÓVK65Ä8gÒÄ1gGKÏhGKh6Ó0ßgg1gÓ0ÔÆyíEIyIyI",
		"diamondOre": "0g0g8÷-ZéŞZâľHÖĎYÔŅWćťYW÷HľZH4íú|y0Bm04ĞıFĠôÖr90g|īiiQČŁ5gòwÿŐ#ĻķQŢC6ÏP|J0ÚČ0mgÃśĊRAmVłg1ÒoăS+ÂAJ0dÊ1F+2Ħİó0ŃPrkPFg1wkúAJÀAJS",
		"diorite": "0g0g6óEYĎóWĦţWŒĖYĶ;ZåŎY4üİPĀă)yR×,gÎ+E?ĠóÒĜbÕX_{oî|iŀö+Ň]ČıÖoŀhĠFM2óöĞTQĻÉúpbĉĚjKĐŇNxRò+lÚóAA(Ã&njÝü^wĐìÞīĸX6įöĊcÒ+ŇNgÉ",
		"dirt": "0g0g7ĢlZýĜYåÃYÆřYðoHÚĞZâÑH4Č9PČg?ČÐSĈÉ9(J9Cĩ)yķBkaEðÂ%UÈ{üÉÖ)ù9Eù84Á]2Â$üòFkÃQČĂ?ČŁPwh?0ìKNÏFihČĎÃ{ĊRPAë?$ò{)9FXĺ1kòEiĊByÃ",
		"emeraldBlock": "0g0g6nkHqěHîŁZ>įHnãWuÏY0000019AĂÖ]ń800w0Ëc)ûJ@Ë8w00mV8wJÚoÒcwăúĀ?c(ĂúĀ?8(ŋ4gÒc(ŋCgÒcħĄim?gĩPAþ?cB01ĠÒgJPAJËg]4ù8ļ+łÚĞłÖ",
		"emeraldOre": "0g0g7÷-ZéŞZâľHÖĎYłťYnãW1ňY4íă|y0BiB4ĜóFĜĖPmİ06ħ0pÂQđÃwbòwăčÒ(gQë&4ĊPPĜħÖČ00gÒBĚRAJÛaÀŀÒkă^Ō!AJ4Ĉ1Þ%Ċ5İ+2ßČ]4üP,g1wkúwiÀAJS",
		"glass": "0g0g5ĺĖYē|Y000æģHôcZ0000019AJPAú9wJPAû94JPAû8ČJPAû9AJPAü9AJPAû9AJPAü9AJPAü9AJPAü9AJPAü9AJPAüFAJPAk9AJPwüFAJPAúCpAJP9",
		"glowstone": "0g0g8ŢÔHĵlHïRYÚiWZZZZĴYòċYÞNH5+T%^ÄĈYĸäŁb?ŋćŢĘÌĶgÃŗãŝèĲ_mćĐÕÈ2wĕKŔùb~ŋ>rĜÍä$āĉÓĦÂñīČĒe+ÿĘFùÂÑDŚÜDïĳĦğşnœ5őjĩÈŗ#ò_ĭíćÜyćŃlŏÍĞť",
		"goldBlock": "0g0g9ŞNHšřWĹÃWZŠWZŢZZĜZZÐZZXYĵNH00h01hg23QVO*ÄÐN4ÓàVKh7N4Ô*ÅK0GÂlâVã0ÔãÂlVÅK6VKo3VGãÒÄ1o3ÅGÓGK18lGãÔãK0ÏlGÓGÓÓ7ÏmãÒÄÓÓÅ8gÓVK65Ä8gÒÄ1gGKÏhGKh6Ó0ßgg1gÓ0ÔÆyíEIyIyI",
		"goldOre": "0g0g8÷-ZéŞZâľHÖĎYZĜYZŢHšĚYZZZ4íú|y0Bm04ĞıFĠôÖr90g|īiiQČŁ5gòwÿŐ#ĻķQŢC6ÏP|J0ÚČ0mgÃśĊRAmVłg1ÒoăS+ÂAJ0dÊ1F+2Ħİó0ŃPrkPFg1wkúAJÀAJS",
		"granite": "0g0gaĞÖWąčYúïWéUH{ĹZĞDHđĽHË3HıÆWŊaZ1xMihTÁmiãoMjMjNnhiCMûnlnihÅmÏNhNjzGwÎyjh+ÏjÞygMMmÐhjÓÏOjh1A,ÓMylxjÓÐNhMÓCM+ÐljmÓ2ÞMEh,+ÓnÎj>h+RRNMhMzhFiÓMDNÓxhoÓzãiÓgMÓh2yMMh+",
		"gravel": "0g0g8ÒÒYó7Zþ-ZÞĎYþÇHìŞZĚóWĚĢZ5,$âł#þģ_ĔÂ{ĝíİþĀĳĜĺÊĞ/ÚÓŋńĝôdlĈİÿİØ$#èßgŔùĿÒčģÎðÅÖ$ÇńčY#üŁĴáįÆĚěKĞj<Ùł#ĔłÙ..$BôFĒŁŌ(ĹÉĐþcGDÚ)ľË",
		"grayConcrete": "0g0g2)ŊZ-ŊZ00000000090000000000000000S100gg",
		"grayWool": "0g0gd-śW<4HTAZTkYTAY)ŊZ<kY-ŊZ?*W?AZ?)Z.4W-ŚZ00i0)ÀÓ7jIüh71Å1ĂhóÎ^QI>g!rq1ĒgòM1yV6cy5âa5051À1IyhmĀMI@0I>đ0!OđQÝûb15hc1pVj3IkIĂQó>đmM10ObA03VjĘVĀĬiÑI*>IüÎÁ^hĐIhĎNò0ÑĘÝþbĐg.0Ă",
		"greenConcrete": "0g0g2PÏHPßHh;ĒÉÙŐßÆðM!ľĈÇylĖ|aŗÈëÀļĸŚđøcKæÙ",
		"greenWool": "0g0gh|íWÁúZÁĉYÇĸH|úZVĨYÇĨYPßWVęYÓhYÁĉZPÏHËňHËŘHÇňHPßH|ßW0S1c4F÷4w7TÂúā^1įčĄ!rkĎMaOcÓČĬS@Ĭ4{2Āī5&!ëìõŖy91õ7.ħħ;13ĩċù1^@M9]q^ČČį8Âûl÷16ĩý÷M÷[k1yIÞEgyí,ą]1ÂýpFàcÑĘĬKĻíI80gëXÓ08ÃĄB8ÌGNfgķÑČďMÈÿpaæõĬFòÐgĎwċ]įQow-së5öÀ^Ň0Ù",
		"ironBlock": "0g0gbĺ;ZĪcWŚĶWŖĦZŒĖYŎĆHĢŒYĚĲWņéZŊ÷WľËH1g0001hgiyyO)VVÁlVVVVVVÄäIIIāĂĒďiyyzOVVÄlVVVVVVÄäIIāāĒĒďizOOVVVÄlVVVVVVÄäIIIòāĒďiyyzO*VÄlVVVVVVÄäIIòāĂĒďiyzO*VVÄlVVVVVVÄhhhmÎÓÓÓ",
		"ironOre": "0g0g8÷-ZéŞZâľHÖĎYĦÕWŁġWĖ,HŊaY4íú|y0Bm04ĞıFĠôÖr90g|īiiQČŁ5gòwÿŐ#īķQŢC6ÏP|J0ÚČ0mgÃśĊRAmVłg1ÒoăS+ÂAJ0dÊ1F+2Ħłó0ĳPrkPFg1wkúAJÀAJS",
		"jungleLog": "0g0g9ÇhYÖNWéßHÀŘHSĸW;ĨWVMYâJHÎÏW1y3OOhg004S404VQQ@ä?US4xh0hy33O(Sh04Q6ñK03OÕÑ??Vh10OO02x??V1g>O(0iwQÁy00QOñðQO)Väë0hhgÕñ4?U>(>UhQ0xh6KQQjÕÓ3)Q010Q?ÀhTg01g>O00OO",
		"jungleLogTop": "0g0g9éßHÎÏWSĸW;ĨWĢmHđŌHĦ+YýČHąīY1xiOyi1g4Q??ÒUQTAGGñIIGÏkãÑQ?Q[>BáVVVV]Â)XÅäñâ[Á*âÅVVâÅTBXÅÆïï]À5XÅÆââ[À5XÅVVïÅÁláÅGäï]Â*XVVVV[Ã)X?QQ@[ÃAññGGGGRAQV?ÄVQTgzxg0izw",
		"junglePlanks": "0g0g7ĢmHđŌHĦ+YýČHąīYåÃHÖiZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"lapisBlock": "0g0gdB×YxPZ*āWMIYtFHxEYsŐWt8HoĿHoĿYt7ZFÆZkĮW100gzkkkljÁÄâÓâÆ5MnVâåÒæ7ÁVÒÁãÔæ5ÞÅGÒrãÈbVVGÔĝÄä5ĝââåÔÅ×7ÅÔGğþÔĂDÔããÅãýÈDÓÞÄãÓþÆ7ÖÒlÔÅÖÆnâāÔÓlãä5ãÇþÖâÅÙlÅÓÓþÔGÆ@ÅGÓãÓâÊoIIñõāĳĳ",
		"lapisOre": "0g0ga÷-ZéŞZâľHÖĎYpÉZxÕYloZgłZhqZgŀZ1gixzyg0hO(01jOii?@jyxãh1g8+ë10yxizN1N2hgj)ìjïzwx,Xð1ðhhEÐw2iNw06Þ1E)ÓjNg1MEIð-ÁMOíOäÏEÂhÖJ0Oh6Áiw9OäÐ+K0iāÎåKw1ixÓKg1yxhhg1hhh0",
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
		"redstoneOre": "0g0g9÷-ZéŞZâľHÖĎYü0Wţ0Wõ0WĐgHĠgH1gixzyg0hx(01jOiiORjNxUh011lÎ1gyxizN1x2hgh*ÞiÅzwxoá@1@hhzMg0ONw05T1zÅih2h1MDÓÎ01MxROw3Myhhg03BK1iz(2âá@i0lÎh6Îxhix01g1yxhhhwhhh0",
		"redWool": "0g0gdüíWĀJWùíWĄJWĐĊWČĊWĈJWĠĹZĐĊHõíWĔĚHĔĊHĀíW1w)0VwÓ2*GïM21JjójĒÎÈVďVM^h/3ĒMçÃ3QFĭ2Q2ya919hw1GQO+ñÃGÄhGVē0^VēV$ĝ1Ĩ2OyĪoJ+5G*GĢVæVĐmÃ30Óh?0ĬylhJĢF)ÒGÂVďĝÎûÈOďĒOĎUäcÒgwĞ1ĒMÉ0ó",
		"sand": "0g0g6ŎăYł/WŊØWľpHĹŏYŖĔY4Ċĸ?ĊĂÑĚŁõr8@+9AĚŀFNĺPĊİÓþóEþ^$üúÒNÇKğÇÛiĲ$þ_%ĚbÒiĄÖüÇ5JÉ(ĚÃ(ĊıBoıÙüÇPĞÇÒĎôlmı?laEĊÇEĒú?oò?kó$üÁ",
		"smoothStone": "0g0g7éŞZâľH÷-ZĒĒYĊóWĚĲWĆåZ42ÂByg&,ÚĕŐqOÖsJ+ŀmĿłĞğy|İsãłp*ĞłÛÖĈ|łÒĕĭŀÃÖČĺPÕmĢŊÚĭő%ĞŊĞģÕ&.+úįŉdğÚĝģ×Â[ÙßÚqlįłĕĠĿN:Øãġx5wiSJg",
		"soulSand": "0g0g6ÇjYSĩH)ĊW]ĹZÖQHåïW4A3{č4ëhÕBCyÁĪFcĊňMItöþĩTįĴõĞ]dIUdħpÖ(KÙq3ÚC3ÏÈRc+İKPRì(qyĬoÖIħ}No{RĈÑwĺRĬwÒðĂëİÐAĞĀĐ^T$4Ĭö-pTÿd",
		"spruceLog": "0g0g6-úW(ÝY{ĨH$ÀY$ÝYUňZ50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"spruceLogTop": "0g0g8UňZQĩWÇiHìîYåÐHòûYÎyZÞRZ4wSQ20%ğsĚ+ŀd%ĦZŤĐdÈłÞğĀj.AJ[ŇLġğŢ[ĉj]ČûPĀjġĎĺĮŇjġĎĺ[ĈOġČûİĉj.ĚņĮŇjġAJ[ĈLğrÚľĉfŖĞłÚĀdġsþ@Ŀ40SQ2ë",
		"sprucePlanks": "0g0g7ìîYåÐHòûYÎyZÞRZÇiHUňZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"stone": "0g0g4÷-ZéŞZâľHÖĎY0ÖĢVÇýÅōÜēđVÀ?5×þĎSB?VØĠü8!VėĢÈý1k5ÄÁÀk1ŀėā×VTV4×@ÿŕ6þčĐÖVV0VÈTÒ",
		"stoneBricks": "0g0g7óEYĆÖZÇÒYéŞZåľYÖĞYÎðW4JPAù2$(0dĞĩxðłÙ8Ł&(sÎĮyNįĪß.ÈiğAõ^ŉĞłÚĞł×ŀ%JÉÚĞAJR4JPë0Łxë3dðŉ&8rK,!MĭĿÚĠŉi(ŋJĲÏdįŃĞł×ĞłÚłÚJ_ÚĞ",
		"tntBottom": "0g0g4ĘÂHĿęY÷-ZùęWkkkkØØØØØØØØZZZZkkkkØØØØØØØØZZZZkkkkØØØØØØØØZZZZkkkkØØØØØØØØZZZZ",
		"tntSide": "0g0gaŐ1YĿęYĘÂHùęWZZZĶ;ZņÚY)ļHoÐZĦĲW0i0i0i0ihzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhz?ÓVÓÒÄÓÑ@GðâÆÔäUÖÆVGÅÄãÓ?ÔÓãGVïþ@ÆÄâÆVðUāāāāāāāāyOyOyOyOhzhzhzhzhzhzhzhzhzhzhzhzyzyzyzyz",
		"tntTop": "0g0g7ĿęYŐ1Y÷-ZĘÂHVVHùęWgTZ4ë]4ë]FNûFNû!ÂĎĸËýÛĮĕÜÓŔ4œ]4Ň]FNěó;û!]ĞŀÇýÛľ+Ĺ[ĕ4òĞłc]!{ĞĹ;û!ÃþĸÖlÛŀĔøÄŔ4ħÝĿį]!NċMOjFÂýFÂýÛĽŔÛĽŔ",
		"waterStill": "0g0g8Īc%ĖĢŔĎĂÚĺ|%Ķ;ŔľËÚZZŔŢŖĕ4üúAùŌPyPBAJBAJA0ÂFy1A2P]JJ?AP]ĊTAiJ4JPAþŗÞJTAJSŀñĀwë_PAJPAÂFAÂQíPPAJPAúPAJPkJFAPA2óPAúzÕawÿşAiP",
		"whiteConcrete": "0g0g3ĶËHĺËHĶ|H4?541S4k40ggh50g?À0Àk1wA0l4g04U0kQ?À4l00U01hÁ0044Àl0hÁ1QÀkTg4Á5h",
		"whiteWool": "0g0gnłêWŊĆHľéZłéZŒĖYŞņHł÷Wņ÷WŚĶWŚņHĺÚYŒĦZľÚYŖĶWZZZŢŖYŎĆYĺËHľÚZŎĖYŖĦZĺËYŞŖY0QNkĮRU*ĔÙÉÊŎĎ1reoįOçĪ,=ì_Ĺÿ.%Æ^ŗXø)uŜïĶÙĳĚýV/Ķyü×J÷ŚU1*RmsÎàĔÂiØçú7.)8ÊŋĉŖpıś*Ŗ^ÑGĈĨ-}ĩSÂ;2šĒdOÊŐčĵçĹÿ<EçĩĞùØpĂķXđp÷ļE%8×ďĢVxÄÿ.Ĕ^sŎčÎĔĹŠĴŕàÿ7ĕčàĵæAzÎćTïŕĀÀŘāŖ",
		"yellowConcrete": "0g0g4řĨHřęHřĨYŕęHlV01zs@S1àÁá?ħń4S9551ÿOÄúKV14ÁVÁN[lÃÆśÁllħħĬĨRļŗh(0oUVUV{Á{0SľQh",
		"yellowWool": "0g0gjŝňZŝŘZŝĸYŝňYŢiHZ>WŢyYŢNZřĨHřĸYZÐZŞ2WŢ2WZÃHZÃYŢyHZNZZ>HŝřW0QNk0MķygPxüĊąØqSĜA$#ÄĮ*Œ:}GEōwKļXö2ŁĹ5ÁO0RĨ890yü]^0ķw122ĜëßÂô2hX!õĝEŖ8Uċāęowĺpę.ĹoĀ1aħJ$RaŋUxÓ1üĎt^ô}â)ōÖÄ>gQgcKXďo2Ñy@8ÀIĠ]x]âEİ.ĄĐĄô>eĽMĒàIĞùķÁSnĄz]yŘïĖK|hëĕ"
	}
}

const blockData = [
	{
		name: "air",
		id: 0,
		textures: [],
		transparent: true,
		shadow: false,
		solid: false
	},
	{
		name: "grass",
		textures: ["dirt", "grassTop", "grassSide"],
	},
	{ name: "dirt" },
	{ name: "stone" },
	{ name: "bedrock" },
	{ name: "sand" },
	{ name: "gravel" },
	{
		name: "leaves",
		transparent: true,
	},
	{
		name: "glass",
		transparent: true,
		shadow: false,
	},
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
	{
		name: "oakLog",
		textures: ["oakLogTop", "oakLog"],
	},
	{ name: "acaciaPlanks" },
	{
		name: "acaciaLog",
		textures: ["acaciaLogTop", "acaciaLog"],
	},
	{ name: "birchPlanks" },
	{
		name: "birchLog",
		textures: ["birchLogTop", "birchLog"],
	},
	{ name: "darkOakPlanks" },
	{
		name: "darkOakLog",
		textures: ["darkOakLogTop", "darkOakLog"],
	},
	{ name: "junglePlanks" },
	{
		name: "jungleLog",
		textures: ["jungleLogTop", "jungleLog"],
	},
	{ name: "sprucePlanks" },
	{
		name: "spruceLog",
		textures: ["spruceLogTop", "spruceLog"],
	},
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
	{
		name: "bookshelf",
		textures: ["oakPlanks", "bookshelf"]
	},
	{ name: "netherrack" },
	{ name: "soulSand" },
	{
		name: "glowstone",
		lightLevel: 15
	},
	{ name: "netherWartBlock" },
	{ name: "netherBricks" },
	{ name: "redNetherBricks" },
	{ name: "netherQuartzOre" },
	{
		name: "quartzBlock",
		textures: ["quartzBlockBottom", "quartzBlockTop", "quartzBlockSide"]
	},
	{
		name: "quartzPillar",
		textures: ["quartzPillarTop", "quartzPillar"]
	},
	{
		name: "chiseledQuartzBlock",
		textures: ["chiseledQuartzBlock", "chiseledQuartzBlockTop"]
	},
	{ name: "chiseledStoneBricks" },
	{ name: "smoothStone" },
	{ name: "andesite" },
	{ name: "polishedAndesite" },
	{ name: "diorite" },
	{ name: "polishedDiorite" },
	{ name: "granite" },
	{ name: "polishedGranite" },
	{ name: "light", textures: "nothing", lightLevel: 15, solid: false, icon: "glass", transparent: true, shadow: false },
	{ name: "water", textures: "waterStill", semiTrans: true, transparent: true, solid: false, shadow: false}
	// I swear, if y'all don't stop asking about TNT every 5 minutes!
	/* {
        name: "tnt",
        textures: ["tntBottom", "tntTop", "tntSide"]
    },*/
]

const BLOCK_COUNT = blockData.length;

// Set defaults on blockData
for (let i = 1; i < BLOCK_COUNT; ++i) {
	const data = blockData[i];
	data.id = i;

	if ( !("textures" in data) ) {
		data.textures = new Array(6).fill(data.name);
	}
	else if (typeof data.textures === "string") {
		data.textures = new Array(6).fill(data.textures);
	}
	else {
		const { textures } = data;

		if (textures.length === 3) {
			textures[3] = textures[2];
			textures[4] = textures[2];
			textures[5] = textures[2];
		}
		else if (textures.length === 2) {
			// Top and bottom are the first texture, sides are the second.
			textures[2] = textures[1];
			textures[3] = textures[2];
			textures[4] = textures[2];
			textures[5] = textures[2];
			textures[1] = textures[0];
		}
	}

	data.transparent = data.transparent || false;

	data.shadow = data.shadow !== undefined
		? data.shadow
		: true;

	data.lightLevel = data.lightLevel || 0;
	data.solid = data.solid !== undefined ? data.solid : true
	data.icon = data.icon || false
	data.semiTrans = data.semiTrans || false
}

const blockIds = {}
blockData.forEach(block => blockIds[block.name] = block.id)

let Block = {
	top: 0x4,
	bottom: 0x8,
	north: 0x20,
	south: 0x10,
	east: 0x2,
	west: 0x1,
}
let Sides = {
	top: 0,
	bottom: 1,
	north: 2,
	south: 3,
	east: 4,
	west: 5,
}

export { texturesFunc, blockData, BLOCK_COUNT, blockIds, Block, Sides };