addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "K", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        effect1: new Decimal(2),
        cost1: new Decimal(10),
    }},
    color: "#4BDC13",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "knowledge", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (inChallenge('t',22)) mult = mult.pow(0.01)
        if (hasUpgrade('p',32)) mult = mult.times(upgradeEffect('p',32))
        if (getBuyableAmount('li',12).gte(1)) mult = mult.times(buyableEffect('li',12))
        if (inChallenge('t', 12)) mult = mult.pow(0.2)
        if (hasUpgrade('e', 11)) mult = mult.times(2)
        if (hasUpgrade('e', 12)) mult = mult.times(3)
        if (hasUpgrade('e', 13)) mult = mult.times(upgradeEffect('e', 13))
        mult = mult.times(temp.t.effect)
        if (hasUpgrade('e', 15)) mult = mult.pow(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.80)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "k", description: "K: Reset for Knowledge.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Begin",
            description: "You recently found the Modding Tree, and as you open GitHub... the adventure begins...",
            cost: new Decimal (1),
            effect() {
                return new Decimal (1)
            },
        },
        12: {
            title: "First Idea",
            description: "Point gain is 6.5x.",
            cost: new Decimal (1),
            effect() {
                return new Decimal (6.5)
            },
            unlocked() {
                if (hasUpgrade('p', 11)) return true
                else return false
            }
        },
        13: {
            title: "Creativity Motivation",
            description: "Knowledge boosts Point gain.",
            cost: new Decimal (3),
            effect() {
                if (hasUpgrade('p',33) && hasUpgrade('e',23)) return player.p.points.add(1).log(1.55).add(1)
                if (hasUpgrade('e', 23)) return player.p.points.add(1).log(1.9).add(1)
                if (inChallenge('t', 11)) return new Decimal(1)
                else
                return player[this.layer].points.add(1).log(3).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                if (hasUpgrade('p', 12)) return true
                else
                return false
            },
        },
        14: {
            title: "Prestigious Momentum",
            description: "Points boost themselves.",
            cost: new Decimal (5),
            effect() {
                if (hasUpgrade('i',11) && inChallenge('t',11)) return new Decimal(1)
                if (hasUpgrade('i',11)) return player.points.add(1).log(1.89).add(1)
                if (inChallenge('t', 11)) return new Decimal(1)
                else
                return player.points.add(1).log(4).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                if (hasUpgrade('p', 13)) return true
                else
                return false
            }
        },
        21: {
            title: "Several Issues",
            description: "You just don't get how to fix the errors. 1.95x to Experience and Lesser Ideas.",
            cost: new Decimal (300),
            unlocked() {
                if (hasUpgrade('e', 14) && hasUpgrade('p',14)) return true
                else
                return false
            }
        },
        22: {
            title: "Desperate Attempts",
            description: "Your code is badly written. Point gain is boosted by itself.",
            cost: new Decimal(400),
            effect() {
                if (hasUpgrade('e', 22)) return player.points.add(1).log(1.77).add(1)
                else
                return player.points.add(1).log(5).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                if (hasUpgrade('p', 21)) return true
                else
                return false
            },
        },
        23: {
            title: "Inflation Problems",
            description: "An upgrade can be responsible for game break. Experience boosts points.",
            cost: new Decimal(730),
            effect() {
                if (hasChallenge('t',12) && hasUpgrade('e',23)) return player.e.points.add(1).log(1.68).add(1)
                if (hasChallenge('t', 12)) return player.e.points.add(1).log(2).add(1)
                if (inChallenge('t', 11)) return player.e.points.add(1).log(15).add(1)
                if (hasUpgrade('e', 23)) return player.e.points.add(1).log(2).add(1)
                else
                return player.e.points.add(1).log(6).add(1)
            },
            effectDisplay() { return format(upgradeEffect('p', 23))+"x"},
            unlocked() {
                if (hasUpgrade('p', 22)) return true
                else
                return false
            }
        },
        24: {
            title: "Giving Up",
            description: "You gain 100% of your Knowledge gain every second.",
            cost: new Decimal(10500),
            unlocked() {
                if (hasUpgrade('p', 23)) return true
                else
                return false
            },        
        },
        31: {
            title: "Double Trouble",
            description: "Unlock the secret Thought Challenge; Brutally hard.",
            cost: new Decimal(1e9),
            unlocked() {
                if (hasChallenge('t', 21) && hasUpgrade('p',24)) return true
                else
                return false
            }
        },
        32: {
            title: "Subtabs Problem",
            description: "Lesser Ideas multiply Knowledge gain.",
            cost: new Decimal(1e10),
            effect() {
                return player.li.points.add(1).log(3).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect('p',32))+"x"
            },
            unlocked() {
                if (hasUpgrade('p',31)) return true
                else
                return false
            }
        },
        33: {
            title: "Smart II",
            description: "'Creativity Motivation' uses a better formula.",
            cost: new Decimal(5e10),
            unlocked() {
                if (hasUpgrade('p',32)) return true
                else
                return false
            }
        },
        34: {
            title: "How to Code Guidebook",
            description: "3x to Lesser Ideas gain",
            cost: new Decimal(1e13),
            unlocked() {
                if (hasUpgrade('p',33)) return true
                else
                return false
            }
        }
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.p.row) {
            // the three lines here
            let keep = []
        if (hasUpgrade('e', 12) && resettingLayer == "e") keep.push("upgrades")
        if (hasMilestone('li', 0) && resettingLayer == "li") keep.push("upgrades")
        if (hasMilestone('i',2)) keep.push("upgrades")
        layerDataReset('p', keep) 
        }    
    },
    passiveGeneration() {
        if (inChallenge('t',22)) return 0
        if (inChallenge('t',21)) return 0
        return hasUpgrade('p', 24) ? 1 : 0
    },
    milestones: {
        0: {
            requirementDescription: "25 Knowledge",
            effectDescription: "Unlock Experience and Lesser Ideas.",
            done() { return player.p.points.gte(25)}
        },
        1: {
            requirementDescription: "75,000 Knowledge",
            effectDescription: "Unlocks 2 new layers.",
            done() { return player.p.points.gte(75000) },
            unlocked() {
                if (hasMilestone('p',0)) return true
                else
                return false
            }
        },
        2: {
            requirementDescription: "1,000,000,000,000,000 Knowledge",
            effectDescription: "Unlocks a secret layer.",
            done() { return player.p.points.gte(1e15)}
        }
    },
    infoboxes: {
        guidek: {
            title: "Knowledge: Guide",
            body() { return "There isn't much stuff to do here. Just buy the first four Knowledge Upgrades, get 25 Knowledge and go for the next 2 layers." },
            unlocked() {
                if (hasUpgrade('p',11)) return true
                else
                return false
            }
        },
        guideli: {
            title: "Lesser Ideas: Guide",
            body() { return "This one is a bit tricky, but not much. Buy the first two buyables 2 times, get 350 Lesser Ideas and buy the last buyable. Go for 1,000 Lesser Ideas, and go for the next layer." },
            unlocked() {
                if (player.li.points.gte(1)) return true
                else
                return false
            }
        },
        guidei: {
            title: "Ideas: Guide",
            body() { return "In order to complete this layer, you must buy all the upgrades in the tree.<br><b>NOTE:</b>I personally recommend you go for 2 ideas before you buy the first upgrade.<b>" },
            unlocked() {
                if (player.i.points.gte(1)) return true
                else
                return false
            }
        },
        guidee: {
            title: "Experience: Guide",
            body() { return "<b>NOTE</b>: This layer is meant to be done first before Lesser Ideas, but if you start with Lesser Ideas, there's absolutely no problem. You gotta buy the first upgrades, and by the point you unlock the new Knowledge Upgrades, you should have already gotten atleast 3 of the first buyable and 2 of the second one in Lesser Ideas. That way it'll be super easy to get the upgrades." },
            unlocked() {
                if (player.e.points.gte(1)) return true
                else
                return false
            }
        },
        guidet: {
            title: "Thoughts: Guide",
            body() { return "<b>Note</b>: If you want faster results, I recommend you go for 2 Ideas first, since you can buy max Thoughts and Ideas. You should go for 3 Thoughts and do the first challenge, after, do the second, and finally the third, after you get the third row of upgrades, you should buy them. Afterwards, you should do the Last Challenge. <b>Note, again: The CHALLENGE is not meant to last 5 minutes, it can be super hard if you aren't prepared.</b>" },
            unlocked() {
                if (player.t.points.gte(1)) return true
                else
                return false
            }
        },
        lore: {
            title: "Knowledge: Lore",
            body() { return "You're done playing Prestige Tree: Rewritten and you heard you could make your own trees. That's when you download GitHub Desktop and Visual Studio Code.<br>You make your first tree, and name it 'The Alez Tree', since well, it's your first tree and you have no themes, but that. You just make the first 4 upgrades of your life, but, you know absolutely no coding. You don't know how to fix the errors you have. But, that doesn't stop you from making the first four upgrades of your life. Everything looks like super easy and yeah... You get happy. <b><br>NEXT PIECE OF LORE AT BUYING A SPECIFIC UPGRADE.</b>" },
        },
        lore2: {
            title: "Several Issues: Lore",
            body() { return "You've tried much stuff, you even tried adding milestones, and you gave up on your first tree that would have been a good idea, but no worries. You started a new one with a real theme, and you even opened Discord to ask help. Even with Discord help, you weren't able to make a proper feature that wasn't just upgrades. A lot of errors happen, and there was this one upgrade that had a much powerful formula, and ended up inflating your save. That's when you start to give up, thinking you're never gonna be able to make a proper tree.<b><br>NEXT PIECE OF LORE AT GETTING 850 EXPERIENCE OR GETTING 3 OF THE FIRST BUYABLE.</b>" },
            unlocked() {
                if (hasUpgrade('p',22)) return true
                else
                return false
            }
        },
        lore3: {
            title: "Ideas and Lesser Ideas: Lore",
            body() { return "After all that, you decide it's time to change. You learn some JS code and think of stuff to do, and it turns out that it works! You have so much ideas, to the point that adding them all can be a pain to do." },
            unlocked() {
                if (getBuyableAmount('li',11).gte(3)) return true
                else
                return false
            }
        },
        lore4: {
            title: "Experience and Thoughts: Lore",
            body() { return "You're happy at the moment, since you made a basic, but functional tree. You try making it more complex, but you fail. You begin with milestones, you fail. You trash your game, and give it a proper theme. You try adding mechanics and you fail AGAIN. You decide it's time to go to discord, and, not even with Discord you were able to make it. You feel like you're not gonna progress, you're filled with negative thoughts." },
            unlocked() {
                if (player.e.points.gte(850)) return true
                else
                return false
            }
        }
    },
    tabFormat: {
        "Main Tab": {
            content: ["main-display","blank","prestige-button","blank","resource-display","upgrades"]
        },
        "Milestones": {
            content: ["blank","blank",["display-text", () => "There should be milestones in here, if there aren't any, then, well, I can't do anything about it."],"milestones"],
            unlocked() {
                if (hasUpgrade('p',11)) return true
                else
                return false
            }
        },
        "Lore": {
            content: ["blank",["display-text", "Lore goes here. EVERYTHING."],"blank",["infobox", "lore"],["infobox", "lore2"],["infobox", "lore3"],["infobox", "lore4"],]
        },
        "Help": {
            content: ["blank",["display-text", "Stuck? Here's everything you'll need to understand."],"blank",["infobox","guidek"],["infobox","guidee"],["infobox","guideli"],["infobox","guidet"],["infobox","guidei"]]
        }
    }
})
addLayer("e", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "experience",                 // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(250),             // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.55,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        mult = new Decimal(1)
        if (hasUpgrade('i',22)) mult = mult.times(upgradeEffect('i',22))
        if (hasUpgrade('p', 21)) mult = mult.times(1.95)
        return mult                         // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.75)
    },

    layerShown() {
        if (player.e.points.gte(1)) return true 
        if (hasMilestone('p',0)) return true
        else
        return false
    },           // Returns a bool for if this layer's node should be visible in the tree.
    color: "#0024FF",
    branches: ['p'],
    upgrades: {
        11: {
            title: "Lack of Knowledge",
            description: "It's hard when you know nothing. Knowledge is boosted by itself.",
            cost: new Decimal (1),
            effect() {
                return player.p.points.add(1).log(4).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            }
        },
        12: {
            title: "Stress^3",
            description: "You now keep Knowledge Upgrades on reset.",
            cost: new Decimal (2),
        },
        13: {
            title: "A Theme",
            description: "You generate more Knowledge based on Points.",
            cost: new Decimal (3),
            effect() {
                return player.points.add(1).log(5).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Ask for Help at Discord",
            description: "Unlocks a new row of Knowledge Upgrades.",
            cost: new Decimal (5)
        },
        21: {
            title: "Impossible Goals",
            description: "Knowledge boosts itself.",
            cost: new Decimal (5000),
            effect() {
                return player.p.points.add(1).pow(0.4)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            },
        },
        22: {
            title: "Total Abandon",
            description: "Desperate Attempts uses a better formula.",
            cost: new Decimal (13500),
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            },
        },
        23: {
            title: "Re-thinking",
            description: "'Inflation Problems' uses a better formula.",
            cost: new Decimal (20000),
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            },
        },
        24: {
            title: "Back at it",
            description: "Yet another bonus to point gain based on Thoughts.",
            cost: new Decimal (100000),
            effect() {
                return player.t.points.add(1).log(3)
            },
            effectDisplay() {
                return format(upgradeEffect('e', 24))+"x"
            },
            unlocked() {
                if (hasMilestone('t', 3)) return true
                else 
                return false
            },
        },
        15: {
            title: "Better Results",
            description: "You feel better as you relax and take it easy. Knowledge and Point gain are raised to the 1.4th power.",
            cost: new Decimal (1e9),
            unlocked() {
                if (hasUpgrade('e', 24)) return true
                else return false
            }
        },
        25: {
            title: "Challenges Problem",
            description: "You keep on failing trying to make a challenge. Does nothing at the moment.",
            cost: new Decimal(1e11),
            unlocked() {
                if (hasUpgrade('e', 15)) return true
                else return false
            }
        },
    },
    hotkeys: [
        {key: "e", description: "E: Reset for experience.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.e.row) {
            // the three lines here
            let keep = []
        if (hasMilestone('t', 0)) keep.push("upgrades")
        layerDataReset('e', keep) 
        }    
    },
    passiveGeneration() {
        if (inChallenge('t',22)) return 0
        if (hasChallenge('t',22)) return 1
        return hasChallenge('t', 22) ? 1 : 0
    },
})
addLayer("t", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                    // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#00FFD8",                       // The color for this layer, which affects many elements.
    resource: "thoughts",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).
    position: 1,
    baseResource: "experience",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.e.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1000),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(0.35)            // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.45)
    },
    exponent: 0.6,
    layerShown() {
        if (player.t.points.gte(1)) return true
        if (hasMilestone('p',1)) return true
        else 
        return false 
    },          // Returns a bool for if this layer's node should be visible in the tree.
    branches: ['e'],
    milestones: {
        0: {
            requirementDescription: "2 thoughts",
            effectDescription: "You keep Experience Upgrades upon reset.",
            done() {
                return player.t.points.gte(2)
            }
        },
        1: {
            requirementDescription: "3 thoughts",
            effectDescription: "Unlock Challenges.",
            done() {
                return player.t.points.gte(3)
            },
        },
        2: {
            requirementDescription: "4 thoughts",
            effectDescription: "Keep Lesser Ideas' buyables on <b>ALL</b> resets.",
            done() {
                return player.t.points.gte(4)
            },
        },
        3: {
            requirementDescription: "20 thoughts",
            effectDescription: "Unlock the last 2 Experience upgrades.",
            done() {
                return player.t.points.gte(20)
            },
        },
    },
    hotkeys: [
        {key: "t", description: "T: Reset for thoughts.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    challenges: {
        11: {
            name: "'You won't make it!'",
            challengeDescription: "The first row of Knowledge Upgrades is disabled and the Prestige 2;3 upgrade (Inflation Problems) is nerfed.",
            goalDescription: "500,000 Knowledge.",
            rewardDescription: "Unlock a new row of Experience Upgrades.",
            canComplete: function() {return player.p.points.gte(500000)},
            unlocked() {
                if (hasMilestone('t', 1)) return true
                else 
                return false
            },
        },
        12: {
            name: "'Just give up!'",
            challengeDescription: "Knowledge gain is ^0.2.",
            goalDescription: "1,500,000 Knowledge.",
            rewardDescription: "The Prestige 2;3 Upgrade is more powerful.",
            canComplete: function() {return player.p.points.gte(1500000)},
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            }
        },
        21: {
            name: "'It's impossible!'",
            challengeDescription: "You don't passively generate Knowledge, you must reset again.",
            goalDescription: "10,000 experience.",
            rewardDescription: "Unlock new upgrades.",
            canComplete: function() { return player.e.points.gte(10000)},
            unlocked() {
                if (hasChallenge('t', 12)) return true
                else
                return false
            },
        },
        22: {
            name: "'TMT doesn't teach you coding, like ???'",
            challengeDescription: "<b>Are you worthy?</b><h5>The Lesser Ideas buyables are useless, thoughts grant no bonus, point & knowledge gain is ^0.01, and you don't passively generate Knowledge.",
            goalDescription: "1e9 Points",
            rewardDescription: "Gain 100% of Lesser Ideas and Experience every second.",
            canComplete: function() { return player.points.gte("1e9") },
            unlocked() {
                if (hasChallenge('t',22)) return true
                if (inChallenge('t',22)) return true
                if (hasUpgrade('p',31)) return true
            }
        }
    },
    tabFormat: {
        "Main Tab": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function() {
                        return "You have " +format(player.p.points)+ " knowledge."
                    }],
                "blank",
                "milestones"
            ],
        },
        "Challenges": {
            content: [
                "main-display",
                "challenges",
            ],
            unlocked() {
                if(hasMilestone('t',1)) return true
                else
                return false
            }
        },
    },
    effect() {
        if (inChallenge('t',22)) return new Decimal(1)
        return player.t.points.add(1).pow(0.84)
    },
    effectDescription() {
        return "granting a " +format(layers.t.effect())+ "x bonus to point and knowledge production."
    },
    canBuyMax() {
        if (hasMilestone('i',1)) return true
        else
        return false
    } 
})
addLayer("li", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.

    }},
    symbol: "LI",
    color: "#9F693D",                       // The color for this layer, which affects many elements.
    resource: "lesser ideas",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    position: 1,                            // The position this layer is on
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires() {
        return new Decimal("250")
    },              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.55,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        if (hasUpgrade('p',34)) mult = mult.times(3)
        if (hasAchievement('a',15)) mult = mult.times(achievementEffect('a',15))
        if (hasUpgrade('i',21)) return mult = mult.times(upgradeEffect('i',21))
        if (hasUpgrade('p', 21)) mult = mult.times(1.95)
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.75)
    },
    layerShown() {
        if (player.li.points.gte(1)) return true
        if (hasMilestone('p',0)) return true
        else
        return false
    },          // Returns a bool for if this layer's node should be visible in the tree.
    branches: ['p'],
    upgrades: {
        11: {
            title: "{deprecated}",
            description: "{deprecated}",
            cost: new Decimal(1e10),
            onPurchase() {
                
            }
        },
    },
    buyables: {
        11: {
            title() { return "Learn some JS code." },
            cost() { return new Decimal(10).pow(getBuyableAmount(this.layer,this.id)) },
            display() { return "Multiply Point Gain by 2, however cost increases by 10.<br>Cost: "+format(new Decimal(10).pow(getBuyableAmount(this.layer,this.id)))+" Lesser Ideas<br>Currently: " + format(buyableEffect('li',11)) + "x<br>" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(new Decimal(10).pow(getBuyableAmount(this.layer,this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                if (inChallenge('t',22)) return new Decimal(1)
                else
                return new Decimal(2).pow(getBuyableAmount(this.layer,this.id))
            }
        },
        12: {
            title() { return "Fix a bug." },
            cost() { return new Decimal(100).pow(getBuyableAmount(this.layer,this.id)) },
            display() { return "Multiply Knowledge gain by Points, however cost increases by 100.<br>Cost: "+format(new Decimal(100).pow(getBuyableAmount(this.layer,this.id)))+" Lesser Ideas<br>Currently: " + format(buyableEffect('li',12)) + "x<br>" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(new Decimal(100).pow(getBuyableAmount(this.layer,this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                if (inChallenge('t',22)) return new Decimal(1)
                else
                return player.points.add(1).pow(getBuyableAmount(this.layer,this.id).pow(0.3).div(9))
            }
        },
        21: {
            title() { return "Make an upgrade." },
            cost() { return new Decimal(7000).pow(getBuyableAmount(this.layer,this.id)) },
            display() { return "Multiply Points by Points, however cost increases by 7000.<br>Cost: "+format(new Decimal(7000).pow(getBuyableAmount(this.layer,this.id)))+" Lesser Ideas<br>Currently: " + format(buyableEffect('li',12)) + "x<br>" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(new Decimal(7000).pow(getBuyableAmount(this.layer,this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                if (inChallenge('t',22)) return new Decimal(1)
                else
                return player.points.add(1).pow(getBuyableAmount(this.layer,this.id).pow(0.2).div(8))
            },
            unlocked() {
                if (hasMilestone('li',1)) return true
                else
                return false
            }
        },
    },
    tabFormat: {
        "Main Tab": {
            content: [
                "main-display","blank","prestige-button","blank","resource-display","blank","buyables","blank","blank"]
        },
        "Milestones": {
            content: [
                "main-display","blank",["display-text", function() { return "There is no reset button here. In fact, you should go back to the tab before this one if you want to reset, or just use the hotkey, but I honestly recommend you go to the first page, or, yeah I don't know you so I'm just gonna let you do whatever."}] ,"blank","milestones"
            ]
        }
    },
    milestones: {
        0: {
            requirementDescription: "10 Lesser Ideas",
            effectDescription: "Keep Knowledge Upgrades on <b>THIS</b> reset.",
            done() {
                return player.li.points.gte(10)
            },
        },
        1: {
            requirementDescription: "350 Lesser Ideas",
            effectDescription: "Unlock a new buyable.",
            done() {
                return player.li.points.gte(350)
            }
        }
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.li.row) {
            // the three lines here
            let keep = []
        if (hasMilestone('t', 2)) keep.push("buyables")
        if (hasMilestone('i',0) && resettingLayer == "i") keep.push("buyables")
        layerDataReset('li', keep) 
        }    
    },
    passiveGeneration() {
        if (inChallenge('t',22)) return 0
        if (hasChallenge('t',22)) return 1
        return hasChallenge('t', 24) ? 1 : 0
    },
}),
addLayer("i", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#177062",                       // The color for this layer, which affects many elements.
    resource: "ideas",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).
    position: 0,
    baseResource: "lesser ideas",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.li.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1000),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.6,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(0.3)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.45)
    },

    layerShown() {
        if (player.i.points.gte(1)) return true
        if (hasMilestone('p',1)) return true 
        else 
        return false },          // Returns a bool for if this layer's node should be visible in the tree.
    branches:['li'],
    upgrades: {
        11: {
            title: "Re-Start",
            description: "'Prestigious Momentum' is buffed.",
            cost: new Decimal("1")
        },
        21: {
            title: "Creativity^2",
            description: "Lesser Ideas are boosted by Ideas.",
            cost() {
                if (hasUpgrade('i',22)) return new Decimal("4")
                else
                return new Decimal(3)
            },
            effect() {
                return player.i.points.add(1).log(5).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect('i',21))+"x"
            }
        },
        22: {
            title: "Learn from Mistakes",
            description: "Experience is boosted by Thoughts.",
            cost() {
                if (hasUpgrade('i',21)) return new Decimal("4")
                else
                return new Decimal(3)
            },
            effect() {
                return player.i.points.add(1).log(5).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect('i',22))+"x"
            }
        },
        31: {
            title: "Proper Ideas",
            description: "Lesser Ideas gain is boosted by 4x.",
            cost() {
                if (hasUpgrade('i',33)) return new Decimal("12")
                else
                return new Decimal(10)
            },
            effect() {
                return new Decimal(4)
            },
        },
        32: {
            title: "Smart I",
            description: "Knowledge is boosted by itself",
            cost() {
                return new Decimal(10)
            },
            effect() {
                return player.p.points.add(1).log(5).add(1)
            },
            effectDisplay() {
                return format(upgradeEffect('i',32))+"x"
            }
        },
        33: {
            title: "JS Lessons",
            description: "Experience gain is boosted by 3x.",
            cost() {
                if (hasUpgrade('i',31)) return new Decimal("12")
                else
                return new Decimal(10)
            },
            effect() {
                return new Decimal(3)
            }
        }
    },   
    milestones: {
        0: {
            requirementDescription: "1 Ideas",
            effectDescription: "Keep Lesser Ideas Buyables on <b>THIS</b> reset.",
            done() {
                return player.i.points.gte(1)
            },
        },
        1: {
            requirementDescription: "2 Ideas",
            effectDescription: "Can buy max Ideas and Thoughts. Yeah, both layers support each other.",
            done() {
                return player.i.points.gte(2)
            }
        },
        2: {
            requirementDescription: "3 Ideas",
            effectDescription: "Keep Prestige Upgrades on reset, ALWAYS.",
            done() {
                return player.i.points.gte(3)
            }
        }
    },
    tabFormat: {
        "Main Tab": {
            content: ["main-display","blank","blank","prestige-button","blank",["display-text", "You have seen normal trees, tab trees or even single layer trees, but have you seen a proper upgrade tree which scales cost??"],"upgrades"]
        },
        "Milestones": {
            content: ["main-display","blank","blank","milestones",["display-text", "Again, there is no reset button here. Just Milestones, and that's all."]]
        }
    },
    canBuyMax() {
        if (hasMilestone('i',1)) return true
        else
        return false
    }    
})
addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    symbol: "ACH",
    color: "#FA0202",                       // The color for this layer, which affects many elements.
    resource: "Senses of Accomplishment",            // The name of this layer's main prestige resource.
    row: "side",                                 // The row this layer is on (0 is the first row).
    position: 2,
    baseResource: "experience",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.e.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e60),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.65,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { 
        return true
    },          // Returns a bool for if this layer's node should be visible in the tree.
    achievements: {
        11: {
            name: "Noob",
            tooltip: "Get 250 Points",
            done() {return player.points.gte(250)},
            onComplete() {
                addPoints('a',4)
            }
        },
        12: {
            name: "Skilled",
            tooltip: "Get 1,000 Prestige Points",
            done() {return player.p.points.gte(1000)},
            onComplete() {
                addPoints('a',3)
            }
        },
        13: {
            name: "Professional",
            tooltip: "Get 75,000 Prestige Points",
            done() {return player.p.points.gte(75000)},
            onComplete() {
                addPoints('a',3)
            }
        },
        14: {
            name: "Learning...",
            tooltip: "Earn your first Experience",
            done() {return player.e.points.gte(1)},
            onComplete() {
                addPoints('a',3)
            }
        },
        15: {
            name: "Expert",
            tooltip: "Get 100 Experience<br>Reward: 1.5x to Lesser Ideas gain.",
            done() {return player.e.points.gte(100)},
            effect() {return new Decimal(1.5)},
            onComplete() {
                addPoints('a',3)
            }
        },
        16: {
            name: "Master",
            tooltip: "Get 1,000 Experience<br>Reward: 1.2x to Lesser Ideas gain.",
            done() {return player.e.points.gte(1000)},
            effect() {return new Decimal(1.2)},
            onComplete() {
                addPoints('a',3)
            }
        },
        17: {
            name: "New Features",
            tooltip: "Get 1 Lesser Ideas.",
            done() {return player.li.points.gte(1)},
            onComplete() {
                addPoints('a',3)
            }
        },
        21: {
            name: "More Features",
            tooltip: "Get 100 Lesser Ideas.",
            done() {return player.li.points.gte(100)},
            onComplete() {
                addPoints('a',3)
            }
        },
        22: {
            name: "The Ultimate",
            tooltip: "Get 1,000 Lesser Ideas.",
            done() {return player.li.points.gte(1000)},
            onComplete() {
                addPoints('a',3)
            }
        },
        23: {
            name: "Thonk",
            tooltip: "Get 1 Thought.",
            done() {return player.t.points.gte(1)},
            onComplete() {
                addPoints('a',3)
            }
        },
        24: {
            name: "You'll never know how to complete it!",
            tooltip: "Get 10 Thoughts.",
            done() {return player.t.points.gte(10)},
            onComplete() {
                addPoints('a',3)
            }
        },
        25: {
            name: "Main Features",
            tooltip: "Get your first Idea.",
            done() {return player.i.points.gte(1)},
            onComplete() {
                addPoints('a',3)
            }
        },
        26: {
            name: "Brainstorm",
            tooltip: "Get 10 Ideas.",
            done() {return player.i.points.gte(10)},
            onComplete() {
                addPoints('a',3)
            }
        },
        27: {
            name: "Basic",
            tooltip: "Do the first challenge.",
            done() {return hasChallenge('t',11)},
            onComplete() {
                addPoints('a',3)
            }
        },
        31: {
            name: "Easy",
            tooltip: "Do the second challenge.",
            done() {return hasChallenge('t',12)},
            onComplete() {
                addPoints('a',3)
            }
        },
        32: {
            name: "Smart Resetting",
            tooltip: "Do the third challenge.",
            done() {return hasChallenge('t',21)},
            onComplete() {
                addPoints('a',3)
            }
        },
        33: {
            name: "🆎",
            tooltip: "Finish the Brutally Hard challenge.<br>Reward: 20x to Point Gain.",
            done() {return hasChallenge('t',22)},
            onComplete() {
                addPoints('a',3)
            }
        },
        34: {
            name: "Impossible",
            tooltip: "Get 25 Thoughts<br>Reward: 1.22x to Ideas.",
            done() {return player.t.points.gte(25)},
            onComplete() {
                addPoints('a',3)
            }
        },
        35: {
            name: "Pointless Knowledge",
            tooltip: "???<br>Reward:^1.2 to Point gain.",
            done() {return player.p.points.gte(1e7) && player.p.points.lte(1000)},
            onComplete() {
                addPoints('a',3)
            }
        },
        36: {
            name: "Nightmares",
            tooltip: "Get 30 Ideas<br>Reward: :draweR",
            done() {return player.i.points.gte(30)},
            onComplete() {
                addPoints('a',3)
            }
        },
        37: {
            name: "The Ultimate II",
            tooltip: "Get 150,000 Lesser Ideas.",
            done() {return player.li.points.gte(150000)},
            onComplete() {
                addPoints('a',3)
            }
        }
    },
    tabFormat: {
        "Achievements": {content:["main-display","blank","achievements"]}
    },
    effect() {
        return player.a.points.add(1).pow(0.19)
    },
    effectDescription() {
        return "which give a " +format(layers.a.effect())+ "x bonus to point production."
    },
})