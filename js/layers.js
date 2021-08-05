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
        if (getBuyableAmount('li',12).gte(1)) mult = mult.times(buyableEffect('li',12))
        if (inChallenge('t', 12)) mult = new Decimal(0.0001)
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
            description: "Point gain is 5x.",
            cost: new Decimal (1),
            effect() {
                return new Decimal (5)
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
                if (hasUpgrade('e', 23)) return player.p.points.add(1).log(1.9).add(1)
                if (inChallenge('t', 11)) return new Decimal(1)
                else
                return player[this.layer].points.add(2).pow(0.49)
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
                if (hasUpgrade('i',11)) return player.points.add(1).log(3).add(1)
                if (inChallenge('t', 11)) return new Decimal(1)
                else
                return player.points.add(1).log(6).add(1)
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
            description: "You just don't get how to fix the errors. 1.95x to Experience Gain",
            cost: new Decimal (250),
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
                if (hasUpgrade('e', 22)) return player.points.add(1).log(3).add(1)
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
                if (hasChallenge('t',12) && hasUpgrade('e',23)) return player.e.points.add(1).log(2).add(1)
                if (hasChallenge('t', 12)) return player.e.points.add(1).log(4).add(1)
                if (inChallenge('t', 11)) return player.e.points.add(1).log(15).add(1)
                if (hasUpgrade('e', 23)) return player.e.points.add(1).log(4).add(1)
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
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.p.row) {
            // the three lines here
            let keep = []
        if (hasUpgrade('e', 12) && resettingLayer == "e") keep.push("upgrades")
        if (hasMilestone('li', 0) && resettingLayer == "li") keep.push("upgrades")
        layerDataReset('p', keep) 
        }    
    },
    passiveGeneration() {
        if (inChallenge('t',21)) return 0
        return hasUpgrade('p', 24) ? 1 : 0
    },
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

    requires: new Decimal(100),             // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.55,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        mult = new Decimal(1)
        if (hasUpgrade('p', 21)) mult = mult.times(1.95)
        if (hasUpgrade('h', 14)) mult = mult.pow(1.32)
        return mult                         // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.75)
    },

    layerShown() { return true },           // Returns a bool for if this layer's node should be visible in the tree.
    color: "#0024FF",
    branches: ['p'],
    upgrades: {
        11: {
            title: "Lack of Knowledge",
            description: "It's hard when you know nothing. 2x to Knowledge gain.",
            cost: new Decimal (1),
        },
        12: {
            title: "Stress^3",
            description: "You give up on your first game, and you decide to start again. You now keep Knowledge Upgrades on reset.",
            cost: new Decimal (2),
        },
        13: {
            title: "A Theme",
            description: "You got an idea for a new theme. You generate more Knowledge based on Points.",
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
            description: "You feel like you're not doing progressing at your own mod. Knowledge boosts itself.",
            cost: new Decimal (5e11),
            effect() {
                return player.p.points.add(1).pow(0.25)
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
            description: "'That's it! I'm outta here, no more The Modding Tree!'",
            cost: new Decimal (2e16),
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            },
        },
        23: {
            title: "Re-thinking",
            description: "'Inflation Problems' uses a better formula.",
            cost: new Decimal (1e20),
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            },
        },
        24: {
            title: "Back at it",
            description: "Yet another bonus to point gain based on Thoughts.",
            cost: new Decimal (1e30),
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
            cost: new Decimal (1e50),
            unlocked() {
                if (hasUpgrade('e', 24)) return true
                else return false
            }
        },
        25: {
            title: "Challenges Problem",
            description: "You keep on failing trying to make a challenge. Unlocks a new layer.",
            cost: new Decimal(5e60),
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
        return hasUpgrade('h', 13) ? 1 : 0
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
    baseResource: "knowledge",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(100000),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(0.2)            // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.35)
    },

    layerShown() {
        if (player.t.points.gte(1)) return true
        if (hasUpgrade('e',14)) return true
        else 
        return false 
    },          // Returns a bool for if this layer's node should be visible in the tree.
    branches: ['e', 'li'],
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
            effectDescription: "Keep Lesser Ideas' Buyables.",
            done() {
                return player.t.points.gte(4)
            },
        },
        3: {
            requirementDescription: "200 thoughts",
            effectDescription: "Unlock the last 2 Experience upgrades.",
            done() {
                return player.t.points.gte(200)
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
            goalDescription: "320,000 Knowledge.",
            rewardDescription: "Unlock a new row of Experience Upgrades.",
            canComplete: function() {return player.p.points.gte(320000)},
            unlocked() {
                if (hasMilestone('t', 1)) return true
                else 
                return false
            },
        },
        12: {
            name: "'Just give up!'",
            challengeDescription: "Knowledge is much harder to earn.",
            goalDescription: "75,000 Knowledge.",
            rewardDescription: "The Prestige 2;3 Upgrade is more powerful.",
            canComplete: function() {return player.p.points.gte(75000)},
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
            rewardDescription: "Unlock a new layer.",
            canComplete: function() { return player.e.points.gte(10000)},
            unlocked() {
                if (hasChallenge('t', 12)) return true
                else
                return false
            },
        },
        22: {
            name: "'TMT doesn't teach you coding, like ???'",
            challengeDescription: "Point gain is ^0.33.",
            goalDescription: "??? Points",
            rewardDescription: "Does nothing at the moment, you could skip this for a while."
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
        if (player.t.points > 10000) return player.t.points.add(1).pow(0.45)
        else
        return player.t.points.add(1).pow(0.55)
    },
    effectDescription() {
        return "granting a " +format(layers.t.effect())+ "x bonus to point and knowledge production."
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
        return new Decimal("100")
    },              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.55,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.75)
    },
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
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
                return new Decimal(2).pow(getBuyableAmount(this.layer,this.id))
            }
        },
        12: {
            title() { return "Fix a bug." },
            cost() { return new Decimal(100).pow(getBuyableAmount(this.layer,this.id)) },
            display() { return "Multiply Knowledge gain by Points, however cost increases by 100.<br>Cost: "+format(new Decimal(100).pow(getBuyableAmount(this.layer,this.id)))+" Lesser Ideas<br>Currently: " + format(buyableEffect('li',12)) + "x<br>" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(new Decimal(10).pow(getBuyableAmount(this.layer,this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return player.points.add(1).pow(getBuyableAmount(this.layer,this.id).pow(0.1).div(10))
            }
        },
    },
    tabFormat: {
        "Main Tab": {
            content: [
                "main-display","blank","prestige-button","blank",["display-text", "You have 14.95 senses of accomplishment, which are granting a F1.79e308x bonus to nothingnesses."],"blank","blank","buyables"]
        },
        "Milestones": {
            content: [
                "main-display","blank",["display-text", function() { return "There is no reset button here. In fact, you should go back to the tab before this one if you want to reset, or just use the hotkey, but I honestly recommend you go to the first page, or, yeah I don't know you so I'm just gonna let you do whatever." },"blank","milestones"]
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
        }
    }
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
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal("1ee5000000000"),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.6,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.85)
    },

    layerShown() { return false },          // Returns a bool for if this layer's node should be visible in the tree.
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
                if (hasUpgrade('i',22)) return new Decimal("100000000")
                else
                return new Decimal(10)
            }
        },
        22: {
            title: "Learn from Mistakes",
            description: "Experience is boosted by Thoughts.",
            cost() {
                if (hasUpgrade('i',21)) return new Decimal("100000000")
                else
                return new Decimal(10)
            }
        },
        31: {
            title: "Proper Ideas",
            description: "Lesser Ideas gain is boosted by 4x.",
            cost() {
                if (hasUpgrade('i',33)) return new Decimal("1e50")
                else
                return new Decimal(500)
            }
        },
        32: {
            title: "Smart I",
            description: "Knowledge is boosted by itself",
            cost() {
                return new Decimal(500)
            }
        },
        33: {
            title: "JS Lessons",
        }
    }       
})
addLayer("h", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#FA0202",                       // The color for this layer, which affects many elements.
    resource: "a",            // The name of this layer's main prestige resource.
    row: 3,                                 // The row this layer is on (0 is the first row).

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
        if (player.h.points.gte(1)) return true
        if (hasUpgrade('e', 25)) return true
        else return false
    },          // Returns a bool for if this layer's node should be visible in the tree.
})