function updateHTML() {
	// Element Setup
	tmp.el = {}
	for (i=0;i<TMP_DATA.ELS.length;i++) {
		let id = TMP_DATA.ELS[i]
		tmp.el[id] = new Element(id)
	}
	
	// Options
	if (player.tab=="options") {
		for (let i=0;i<Object.keys(MODES).length;i++) tmp.el[Object.keys(MODES)[i]+"Mode"].setClasses({btn: true, tb: true, opt: (!modesSelected.includes(Object.keys(MODES)[i])), optSelected: modesSelected.includes(Object.keys(MODES)[i])})
		tmp.el.sf.setTxt("Significant Figures: "+player.options.sf.toString())
		tmp.el.not.setTxt("Notation: "+capitalFirst(player.options.not))
		tmp.el.theme.setTxt("Theme: "+capitalFirst(player.options.theme))
		tmp.el.autoSave.setTxt("Auto-Save: "+(player.options.autoSave?"ON":"OFF"))
	}
	
	// Main
	if (player.tab=="main") {
		// Pre-Ranks
		tmp.el.distance.setTxt(formatDistance(player.distance)+" (+"+formatDistance((tmp.nerfs.adjust(player.velocity, "dist").times(tmp.nerfs.active("noTS")?1:tmp.timeSpeed)))+"/sec)")
		tmp.el.velocity.setTxt(formatDistance(player.velocity)+"/s (+"+formatDistance((tmp.nerfs.adjust(tmp.acc, "vel").times(tmp.nerfs.active("noTS")?1:tmp.timeSpeed)))+"/sec)")
		tmp.el.maxVel.setTxt(formatDistance(tmp.maxVel))
		tmp.el.acceleration.setTxt(formatDistance(tmp.acc))
		
		// Ranks
		tmp.el.rank.setTxt(showNum(player.rank))
		tmp.el.rankUp.setClasses({btn: true, locked: !tmp.ranks.canRankUp})
		tmp.el.rankDesc.setTxt(tmp.ranks.desc)
		tmp.el.rankReq.setTxt(formatDistance(tmp.ranks.req))
		tmp.el.rankName.setTxt((tmp.scaling.getName("rank"))+"Rank")
		
		// Tiers
		tmp.el.tier.setTxt(showNum(player.tier))
		tmp.el.tierUp.setClasses({btn: true, locked: !tmp.tiers.canTierUp})
		tmp.el.tierDesc.setTxt(tmp.tiers.desc)
		tmp.el.tierReq.setTxt(showNum(tmp.tiers.req))
		tmp.el.tierName.setTxt((tmp.scaling.getName("tier"))+"Tier")
	}
	
	// Rockets
	if (player.tab=="rockets") {
		// Rockets
		tmp.el.rocketReset.setClasses({btn: true, locked: !tmp.rockets.canRocket, rckt: tmp.rockets.canRocket})
		tmp.el.rocketGain.setTxt(showNum(tmp.rockets.layer.gain))
		tmp.el.rocketsAmt.setTxt(showNum(player.rockets)+" rockets"+((tmp.ach[95].has && !tmp.nerfs.active("noRockets"))?(" (+"+showNum(tmp.rockets.layer.gain)+"/sec)"):(tmp.collapse.hasMilestone(9) && !tmp.nerfs.active("noRockets"))?(" (+"+showNum(tmp.rockets.layer.gain.div(100))+"/sec)"):""))
		tmp.el.rocketsEff.setTxt(showNum(tmp.rockets.eff))
		
		// Rocket Fuel
		tmp.el.rf.setTxt(showNum(player.rf)+(tmp.freeRF.gt(0)?(" + "+showNum(tmp.freeRF)):""))
		tmp.el.rfReset.setClasses({btn: true, locked: !tmp.rf.can, rckt: tmp.rf.can})
		tmp.el.rfReq.setTxt(showNum(tmp.rf.req))
		tmp.el.rfEff.setTxt(showNum(tmp.rf.eff.sub(1).times(100)))
		tmp.el.rfName.setTxt((tmp.scaling.getName("rf"))+"Rocket Fuel")
		tmp.el.rf2.setTxt(showNum(tmp.rf.eff2))
	}
	
	// Features
	tmp.el.nextFeature.setTxt((tmp.nf === "none") ? "" : (tmp.features[tmp.nf].desc))
	
	// Achievements
	if (player.tab=="achievements") {
		tmp.el.achDesc.setHTML(tmp.ga+"/"+tmp.ta+"<br>"+(tmp.selAch==0?"":tmp.ach[tmp.selAch].desc))
		let all = tmp.ga==tmp.ta&&!tmp.modes.aau.active
		for (let r=1;r<=ACH_DATA.rows;r++) {
			for (let c=1;c<=ACH_DATA.cols;c++) {
				let id = r*10+c
				tmp.el["ach"+id].setTxt(id)
				tmp.el["ach"+id].setClasses({achCont: true, gld: (all), dgn: (player.achievements.includes(id)&&ACH_DATA.descs[id]!==undefined&&!all), blocked: ACH_DATA.descs[id]===undefined})
				tmp.el["ach"+id].changeStyle("visibility", (getAllAchievements().includes(id)?"visible":"hidden"))
			}
		}
	}
	
	// Automation
	if (player.tab=="auto") {
		// Robots
		tmp.el.scraps.setTxt(showNum(player.automation.scraps)+" scraps"+(" (+"+showNum(tmp.nerfs.adjust(tmp.auto.scrapGain, "scraps").times(tmp.nerfs.active("noTS")?1:tmp.timeSpeed))+"/sec)"))
		tmp.el.intAmt.setTxt(showNum(player.automation.intelligence)+" intelligence"+(" (+"+showNum(tmp.nerfs.adjust(tmp.auto.intGain, "intel").times(tmp.nerfs.active("noTS")?1:tmp.timeSpeed))+"/sec)"))
		for (let i=0;i<Object.keys(ROBOT_REQS).length;i++) {
			tmp.el[Object.keys(ROBOT_REQS)[i]].setTxt(tmp.auto[Object.keys(ROBOT_REQS)[i]].btnTxt)
			tmp.el[Object.keys(ROBOT_REQS)[i]].setClasses({btn: true, locked: (player.automation.scraps.lt(Object.values(ROBOT_REQS)[i])&&!Object.keys(player.automation.robots).includes(Object.keys(ROBOT_REQS)[i])), rckt: (!(player.automation.scraps.lt(Object.values(ROBOT_REQS)[i])&&!Object.keys(player.automation.robots).includes(Object.keys(ROBOT_REQS)[i])))})
		}
		tmp.el.rankCheapbot.setDisplay(tmp.modes.extreme.active)
		tmp.el.fuelbot.setDisplay(tmp.collapse.hasMilestone(5)||(player.automation.robots.fuelbot?player.automation.robots.fuelbot[1].gt(0):false))
		tmp.el.robotTab.setDisplay(player.automation.open!="none")
		tmp.el.robotName.setTxt(capitalFirst(player.automation.open=="rankCheapbot"?"Rank Cheapener-bot":player.automation.open))
		tmp.el.robotInterval.setTxt(player.automation.open=="none"?"":formatTime(tmp.auto[player.automation.open].interval))
		tmp.el.robotMagnitude.setTxt(player.automation.open=="none"?"":showNum(tmp.auto[player.automation.open].magnitude))
		tmp.el.buyRobotInterval.setHTML(player.automation.open=="none"?"":("Upgrade Interval<br>Cost: "+showNum(tmp.auto[player.automation.open].intCost)+" intelligence."))
		tmp.el.buyRobotMagnitude.setHTML(player.automation.open=="none"?"":("Upgrade Magnitude<br>Cost: "+showNum(tmp.auto[player.automation.open].magCost)+" intelligence."))
		if (player.automation.open != "none") {
			tmp.el.buyRobotInterval.setClasses({btn: true, locked: (player.automation.intelligence.lt(tmp.auto[player.automation.open].intCost)), rckt: player.automation.intelligence.gte(tmp.auto[player.automation.open].intCost)})
			tmp.el.buyRobotMagnitude.setClasses({btn: true, locked: (player.automation.intelligence.lt(tmp.auto[player.automation.open].magCost)), rckt: player.automation.intelligence.gte(tmp.auto[player.automation.open].magCost)})
		}
		tmp.el.robotMax.setDisplay(tmp.ach[48].has)
		
		// Automators
		for (let i=0;i<Object.keys(AUTOMATORS).length;i++) {
			tmp.el["automatorDiv-"+Object.keys(AUTOMATORS)[i]].setDisplay(Object.values(AUTOMATORS)[i]())
			player.automators[Object.keys(AUTOMATORS)[i]] = (tmp.el["automator-"+Object.keys(AUTOMATORS)[i]].isChecked()&&Object.values(AUTOMATORS)[i]())
		}
	}
	
	// Time Reversal
	if (player.tab=="tr") {
		tmp.el.rt.setTxt(tmp.tr.txt)
		tmp.el.tc.setTxt(showNum(player.tr.cubes)+" Time Cubes"+(" (+"+showNum(tmp.nerfs.adjust(tmp.tr.cg, "tc").times(tmp.nerfs.active("noTS")?1:tmp.timeSpeed))+"/sec)"))
		tmp.el.frf.setTxt(showNum(tmp.tr.eff))
		for (let i=1;i<=TR_UPG_AMT;i++) {
			let upg = TR_UPGS[i]
			let desc = upg.desc
			if (!tmp.tr2e.eq(1)&&i==2) desc+="<span class='grossminitxt'>(^"+showNum(tmp.tr2e)+")</span>"
			if (!tmp.tr11pow.eq(1)&&i==11) desc+="<span class='grossminitxt'>(^"+showNum(tmp.tr11pow)+")</span>"
			tmp.el["tr"+i].setHTML(desc+"<br>Cost: "+showNum(upg.cost)+" Time Cubes.")
			if (upg.current!==undefined && (i>15?tmp.modes.extreme.active:true)) tmp.el["tr"+i].setTooltip("Currently: "+upg.disp(upg.current()))
			tmp.el["tr"+i].setClasses({btn: true, locked: (!player.tr.upgrades.includes(i)&&player.tr.cubes.lt(upg.cost)), bought: player.tr.upgrades.includes(i), rt: (!player.tr.upgrades.includes(i)&&player.tr.cubes.gte(upg.cost))})
		}
		tmp.el.trRow3.setDisplay(player.dc.unl||tmp.inf.upgs.has("1;4"))
		tmp.el.trRow4.setDisplay(tmp.modes.extreme.active)
		tmp.el.trRow5.setDisplay(tmp.modes.extreme.active&&player.collapse.unl)
		tmp.el.trRow6.setDisplay(tmp.modes.extreme.active&&player.dc.unl)
	}
	
	// Universal Collapse
	if (player.tab=="collapse") {
		tmp.el.collapseReset.setClasses({btn: true, locked: !tmp.collapse.can, btndd: tmp.collapse.can})
		tmp.el.cadaverGain.setTxt(showNum(tmp.collapse.layer.gain))
		tmp.el.cadavers.setHTML("<span class='dead'>"+showNum(player.collapse.cadavers)+"</span> cadavers<span class='dead'>"+((tmp.ach[96].has && !tmp.nerfs.active("noCadavers"))?(" (+"+showNum(tmp.collapse.layer.gain.div(100))+"/sec)"):(tmp.inf.upgs.has("2;4") && !tmp.nerfs.active("noCadavers"))?(" (+"+showNum(tmp.collapse.layer.gain)+"/sec)"):"")+"</span>")
		tmp.el.cadaverEff.setTxt(showNum(tmp.collapse.eff))
		tmp.el.sacrificeCadavers.setClasses({btn: true, locked: player.collapse.cadavers.eq(0), btndd: player.collapse.cadavers.gt(0)})
		tmp.el.lifeEssence.setHTML("<span class='alive'>"+showNum(player.collapse.lifeEssence)+"</span> life essence<span class='alive'>"+((tmp.ach[97].has && !tmp.nerfs.active("noLifeEssence"))?(" (+"+showNum(player.collapse.cadavers.times(tmp.collapse.sacEff).max(1))+"/sec)"):(tmp.inf.upgs.has("5;3") && !tmp.nerfs.active("noLifeEssence"))?(" (+"+showNum(player.collapse.cadavers.times(tmp.collapse.sacEff).max(1).div(10))+"/sec)"):""))
		for (let i=1;i<=EM_AMT;i++) {
			let ms = ESSENCE_MILESTONES[i]
			tmp.el["lem"+i].setHTML(ms.desc+"<br>Req: "+showNum(ms.req)+" Life Essence.")
			if (ms.disp!==undefined) tmp.el["lem"+i].setTooltip("Currently: "+ms.disp())
			tmp.el["lem"+i].setClasses({msCont: true, r: !tmp.collapse.hasMilestone(i)})
		}
	}
	
	// Pathogens
	if (player.tab=="pathogens") {
		tmp.el.pathogensAmt.setHTML("<span class='grosstxt'>"+showNum(player.pathogens.amount)+"</span> Pathogens<span class='grosstxt'>"+(" (+"+showNum(tmp.nerfs.adjust(tmp.pathogens.gain, "pathogens"))+"/sec)")+"</span>")
		for (let i=1;i<=PTH_AMT;i++) {
			let hidden = (PTH_UPGS[i].unl?(!PTH_UPGS[i].unl()):false)
			tmp.el["pth"+i].setDisplay(!hidden)
			tmp.el["pth"+i].setClasses({btn: true, locked: player.pathogens.amount.lt(tmp.pathogens[i].cost), gross: player.pathogens.amount.gte(tmp.pathogens[i].cost)})
			tmp.el["pth"+i].setHTML(PTH_UPGS[i].desc+"<br>"+(tmp.scaling.getName("pathogenUpg", i))+"Level: "+showNum(player.pathogens.upgrades[i])+(tmp.pathogens[i].extra.gt(0)?(" + "+showNum(tmp.pathogens[i].extra)):"")+"<br>Currently: "+tmp.pathogens[i].disp+(player.pathogens.upgrades[i].gte(tmp.pathogens.sc[i])?("<span class='sc'>(softcapped)</span>"):"")+"<br>Cost: "+showNum(tmp.pathogens[i].cost)+" Pathogens.")
		}
		tmp.el.pthUpgPow.setHTML((!tmp.pathogens.upgPow.eq(1))?("Upgrade Power: "+showNum(tmp.pathogens.upgPow.times(100))+"%<br>"):"")
	}
	
	// Softcaps
	for (let i=0;i<Object.keys(tmp.sc).length;i++) {
		let name = Object.keys(tmp.sc)[i]
		let reached = Object.values(tmp.sc)[i]
		tmp.el[name+"SC"].setTxt(reached?("(softcapped)"):"")
		tmp.el[name+"SC"].setClasses({sc: true})
	}
	
	// The Dark Circle
	if (player.tab=="dc") {
		tmp.el.darkMatter.setHTML("Dark Matter<br>Amount: "+showNum(player.dc.matter)+"<br>Gain: +"+showNum(tmp.nerfs.adjust(tmp.dc.dmGain, "dc").times(tmp.dc.flow))+"/s<br>Effect: You gain "+showNum(tmp.dc.dmEff)+"x as many Rockets.")
		tmp.el.darkEnergy.setHTML("Dark Energy<br>Amount: "+showNum(player.dc.energy)+"<br>Gain: +"+showNum(tmp.nerfs.adjust(tmp.dc.deGain, "dc").times(tmp.dc.flow))+"/s<br>Effect: You gain "+showNum(tmp.dc.deEff)+"x as many Time Cubes.")
		tmp.el.darkFluid.setHTML("Dark Fluid<br>Amount: "+showNum(player.dc.fluid)+"<br>Gain: +"+showNum(tmp.nerfs.adjust(tmp.dc.dfGain, "dc").times(tmp.dc.flow))+"/s<br>Effect: Scaled Rocket Fuel scaling starts "+showNum(tmp.dc.dfEff)+" Rocket Fuel later.")
		tmp.el.darkCore.setHTML(tmp.scaling.getName("darkCore")+"Dark Cores<br>Amount: "+showNum(player.dc.cores)+"<br>Cost: "+showNum(tmp.dc.coreCost)+" Cadavers"+(tmp.dc.coreEff.gt(0)?("<br>Effect: +"+showNum(tmp.dc.coreEff.times(100))+"% Pathogen Upgrade Power"):""))
		tmp.el.darkCore.setClasses({darkcore: true, locked: player.collapse.cadavers.lt(tmp.dc.coreCost), inactive: tmp.dc.dmGain.eq(0)})
		tmp.el.arrowToDarkMatter.setHTML(tmp.dc.dmGain.gt(0)?"&#8593;":"")
		tmp.el.darkFlow.setTxt(showNum(tmp.dc.flow))
	}
	
	// Infinity
	if (player.tab=="inf") {
		// Infinity
		tmp.el.endorsementManual.setDisplay(player.inf.endorsements.gte(10)&&(tmp.inf.can||tmp.inf.stadium.canComplete))
		tmp.el.emInner.setHTML(tmp.inf.stadium.canComplete?('Complete this Stadium challenge.'):('Allow <span class="infinity">Infinity</span> to endorse you.'))
		tmp.el.forceInf.setDisplay(player.inf.endorsements.gte(10))
		if (infTab=="infinity") {
			tmp.el.endorsements.setTxt(showNum(player.inf.endorsements))
			tmp.el.knowledgeBase.setTxt(showNum(tmp.inf.knowledgeBase))
			tmp.el.nextEndorsement.setTxt(formatDistance(tmp.inf.req))
			tmp.el.knowledge.setTxt(showNum(player.inf.knowledge))
			tmp.el.knowledgeGain.setTxt(showNum(tmp.nerfs.adjust(tmp.inf.knowledgeGain, "knowledge")))
			tmp.el.infUpgData.setHTML(tmp.inf.upgs.desc(tmp.infSelected))
			for (let r=1;r<=INF_UPGS.rows;r++) {
				for (let c=1;c<=INF_UPGS.cols;c++) {
					let id=r+";"+c
					let state = ""
					if (tmp.inf.upgs.repealed(id)) state="repealed"
					else if (!tmp.inf.upgs.canBuy(id)) state="locked"
					else if (tmp.inf.upgs.has(id)) state = "bought"
					else if (player.inf.knowledge.gte(INF_UPGS.costs[id])) state="unbought"
					else state="locked"
					tmp.el["inf"+id].setDisplay(tmp.inf.upgs.shown(id))
					tmp.el["inf"+id].setClasses({btn: true, inf: state=="unbought", locked: state=="locked", bought: state=="bought", repealed: state=="repealed"})
				}
			}
			tmp.el.endorsementName.setTxt(tmp.scaling.getName("endorsements")+" ")
		}
		
		// Ascension
		if (infTab=="ascension") {
			for (let i=1;i<=4;i++) {
				tmp.el["perk"+i].setClasses({btn: true, perk: tmp.inf.asc.perkActive(i), inf: (!(tmp.inf.asc.perksActive()>=tmp.inf.asc.maxPerks)&&!tmp.inf.asc.perkActive(i)), locked: ((tmp.inf.asc.perksActive()>=tmp.inf.asc.maxPerks)&&!tmp.inf.asc.perkActive(i))})
				tmp.el["perk"+i].setTxt(capitalFirst(PERK_NAMES[i-1])+" Perk"+(tmp.inf.asc.perkActive(i)?(": "+formatTime(player.inf.ascension.time[i-1])):""))
				tmp.el["perkEff"+i].setTxt(showNum(tmp.inf.asc.perkEff(i)))
				tmp.el["enl"+i].setTxt(showNum(player.inf.ascension.enlightenments[i-1]))
				tmp.el["enleff"+i].setTxt(showNum(tmp.inf.asc.enlEff(i).times(100)))
				tmp.el["buyEnl"+i].setTxt("Cost: "+showNum(tmp.inf.asc.enlCost(i))+" Ascension Power")
				tmp.el["buyEnl"+i].setClasses({btn: true, inf: player.inf.ascension.power.gte(tmp.inf.asc.enlCost(i)), locked: player.inf.ascension.power.lt(tmp.inf.asc.enlCost(i))})
				let name = tmp.scaling.getName("enlightenments", i)
				tmp.el["enlScale"+i].setTxt(name==""?"":(name+" "))
			}
			tmp.el.perkPower.setTxt("Perk Strength: "+showNum(tmp.inf.asc.perkStrength.times(100))+"%")
			tmp.el.perkPower.setDisplay(!tmp.inf.asc.perkStrength.eq(1))
			tmp.el.ascPower.setHTML("Ascension Power: <span style='font-size: 25px; color: red;'>"+showNum(player.inf.ascension.power)+"</span> (+"+showNum(tmp.nerfs.adjust(tmp.inf.asc.powerGain, "ascension"))+"/sec)")
		}
		
		// The Stadium
		if (infTab=="stadium") {
			for (let i=0;i<Object.keys(STADIUM_DESCS).length;i++) {
				let name = Object.keys(STADIUM_DESCS)[i]
				tmp.el[name+"Div"].setTooltip(tmp.inf.stadium.tooltip(name))
				tmp.el[name+"Div"].setClasses({stadiumChall: true, comp: player.inf.stadium.completions.includes(name)})
				let active = player.inf.stadium.current==name
				let trapped = !active && tmp.inf.stadium.active(name)
				let comp = player.inf.stadium.completions.includes(name)
				tmp.el[name+"Chall"].setTxt(trapped?"Trapped":(active?"Active":(comp?"Completed":"Start")))
				tmp.el[name+"Chall"].setClasses({btn: true, bought: (trapped||active), locked: (player.inf.stadium.current!=""&&!(trapped||active)), inf: !(trapped||active||player.inf.stadium.current!="")})
				let showCurrent = STADIUM_REWARDS.effects[name]!==undefined
				tmp.el[name+"Btm"].setHTML("Goal: "+formatDistance(tmp.inf.stadium.goal(name))+"<br>Reward: "+STADIUM_REWARDS[name]+"<br>"+(showCurrent?("Currently: "+STADIUM_REWARDS.disp[name]()):""))
			}
			tmp.el.exitStad.setDisplay(player.inf.stadium.current!="")
		}
		
		// The Pantheon
		if (infTab=="pantheon") {
			tmp.el.spectralGems.setTxt(showNum(player.inf.pantheon.gems))
			tmp.el.nextSpectralGem.setTxt(showNum(tmp.inf.pantheon.next))
			let name = tmp.scaling.getName("spectralGems")
			tmp.el.spectralGemName.setTxt(name==""?"":(name+" "))
			tmp.el.respecSpectralGems.setClasses({btn: true, inf: player.inf.pantheon.angels.plus(player.inf.pantheon.demons).gt(0), locked: !player.inf.pantheon.angels.plus(player.inf.pantheon.demons).gt(0)})
			tmp.el.angels.setTxt(showNum(player.inf.pantheon.angels))
			tmp.el.demons.setTxt(showNum(player.inf.pantheon.demons))
			tmp.el.transferAngels.setClasses({btn: true, inf: player.inf.pantheon.gems.gte(1), locked: player.inf.pantheon.gems.lt(1)})
			tmp.el.transferDemons.setClasses({btn: true, inf: player.inf.pantheon.gems.gte(1), locked: player.inf.pantheon.gems.lt(1)})
			tmp.el.chips.setTxt(showNum(player.inf.pantheon.heavenlyChips))
			tmp.el.chipGain.setTxt("(+"+showNum(tmp.nerfs.adjust(tmp.inf.pantheon.chipGain, "heavenlyChips"))+"/sec)")
			tmp.el.chipBoost.setTxt(showNum(tmp.inf.pantheon.chipBoost.sub(1).times(100)))
			tmp.el.souls.setTxt(showNum(player.inf.pantheon.demonicSouls))
			tmp.el.soulGain.setTxt("(+"+showNum(tmp.nerfs.adjust(tmp.inf.pantheon.soulGain, "demonicSouls"))+"/sec)")
			tmp.el.soulBoost.setTxt(showNum(tmp.inf.pantheon.soulBoost.sub(1).times(100)))
			tmp.el.purgeDiv.setDisplay(player.inf.pantheon.purge.unl)
			tmp.el.purgeBtn.setTxt(player.inf.pantheon.purge.active?("Exit Purge run"+(tmp.inf.pantheon.purgeGain.gt(0)?(" for "+showNum(tmp.inf.pantheon.purgeGain)+" Purge Power."):(". You need "+formatDistance(tmp.inf.pantheon.purgeNext)+" to gain more Purge Power."))):"Start Purge run")
			tmp.el.purgePower.setTxt(showNum(player.inf.pantheon.purge.power))
			tmp.el.purgePowerEff.setTxt(showNum(tmp.inf.pantheon.ppe))
		}
		
		// Derivatives
		if (infTab=="derivatives") {
			for (let i=0;i<DERV.length;i++) {
				let name = DERV[i]
				tmp.el["dervDiv"+name].setDisplay(tmp.inf.derv.unlocked(name))
				tmp.el["derv"+name].setTxt(formatDistance(tmp.inf.derv.amt(name)))
				tmp.el["dervgain"+name].setTxt("(+"+formatDistance(tmp.inf.derv.gain(name))+"/sec)")
			}
			let dervName = player.inf.derivatives.unlocks.gte(tmp.inf.derv.maxShifts)?"Boosts":"Shifts"
			tmp.el.dervUnlock.setHTML(tmp.scaling.getName("dervBoost")+" Derivative "+dervName+" ("+showNum(player.inf.derivatives.unlocks)+")<br>Cost: "+showNum(tmp.inf.derv.unlCost)+" Knowledge")
			tmp.el.dervUnlock.setClasses({btn: true, locked: player.inf.knowledge.lt(tmp.inf.derv.unlCost), inf: player.inf.knowledge.gte(tmp.inf.derv.unlCost)})
		}
	}
	
	// Extreme Mode
	tmp.el.rankCheapDiv.setDisplay(tmp.modes.extreme.active)
	if (tmp.modes.extreme.active) {
		// Rank Cheapeners
		tmp.el.rankCheap.setTxt(showNum(player.rankCheap)+(tmp.rankCheap.free.eq(0)?"":(" + "+showNum(tmp.rankCheap.free))))
		tmp.el.rankCheapUp.setClasses({btn: true, locked: !tmp.rankCheap.can})
		tmp.el.rankCheapReq.setTxt(formatDistance(tmp.rankCheap.req))
		tmp.el.rankCheapName.setTxt((tmp.scaling.getName("rankCheap"))+"Rank Cheapener")
		
		// The Furnace
		tmp.el.coal.setTxt(showNum(player.furnace.coal)+" Coal"+(" (+"+showNum(tmp.nerfs.adjust(tmp.fn.gain, "fn").times(tmp.nerfs.active("noTS")?1:tmp.timeSpeed))+"/sec)"))
		tmp.el.coalEff.setTxt(showNum(tmp.fn.eff))
		for (let i=1;i<=3;i++) {
			tmp.el["fnu"+i].setClasses({btn: true, locked: player.furnace.coal.lt(tmp.fn.upgs[i].cost), fn: player.furnace.coal.gte(tmp.fn.upgs[i].cost)})
			tmp.el["fnu"+i+"cost"].setTxt(showNum(tmp.fn.upgs[i].cost))
			tmp.el["fnu"+i+"name"].setTxt(tmp.scaling.getName("fn", i))
			tmp.el["fnu"+i+"lvl"].setTxt(showNum(player.furnace.upgrades[i-1]))
		}
		tmp.el.bf.setClasses({btn: true, locked: player.furnace.coal.lt(tmp.fn.bfReq), fn: player.furnace.coal.gte(tmp.fn.bfReq)})
		tmp.el.bfReq.setTxt(showNum(tmp.fn.bfReq))
		tmp.el.bfAmt.setTxt(showNum(player.furnace.blueFlame))
		tmp.el.bfEff.setTxt(showNum(ExpantaNum.sub(1, tmp.fn.bfEff).times(100)))
	}
	
	// Miscellaneous
	tmp.el.ts.setHTML((tmp.timeSpeed.eq(1)||tmp.nerfs.active("noTS"))?"":("Time Speed: "+showNum(tmp.timeSpeed)+"x<br>"))
	tmp.el.body.changeStyle("background", tmp.bc)
	let root = document.documentElement
	root.style.setProperty("--plaintxt", player.options.theme=="dark"?"white":'black')
	root.style.setProperty("--tb", player.options.theme=="dark"?"#00968f":"#03fcf0")
	root.style.setProperty("--ach", player.options.theme=="dark"?"#287d1b":"#4ceb34")
	root.style.setProperty("--rbt", player.options.theme=="dark"?"#666666":"#c9c9c9")
	root.style.setProperty("--threeArrows", player.options.theme=="dark"?'url("images/threeArrows2.jpg")':'url("images/threeArrows.jpg")')
	
	tmp.el.tdeEff.setHTML(tmp.ach[63].has?("Time Doesn't Exist multiplier: "+showNum(tmp.ach63)+"x "+(tmp.ach63.gte(tmp.ach63sc)?("<span class='sc'>(softcapped)</span>"):"")+"<br><br>"):"")
	tmp.el.tudeEff.setHTML(tmp.ach[112].has?("The Universe Doesn't Exist multiplier: "+showNum(tmp.ach112)+"x<br><br>"):"")
	tmp.el.mainContainer.setDisplay(showContainer)
	tmp.el.mvName.setTxt(tmp.nerfs.active("maxVelActive")?"Maximum Velocity:":"Velocital Energy:")
	tmp.el.accEn.setHTML(tmp.accEn.gt(0)?(" (Accelerational Energy: "+formatDistance(tmp.accEn)+"/s<sup>2</sup>)"):"")
	tmp.el.footer.setDisplay(player.tab=="options"&&player.optionsTab!=="saving")
}