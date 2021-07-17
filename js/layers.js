addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (inChallenge('t', 12)) mult = new Decimal(0.0001)
        if (hasUpgrade('p', 14)) mult = mult.times(upgradeEffect('p', 14))
        if (hasUpgrade('e', 11)) mult = mult.times(2)
        if (hasUpgrade('e', 12)) mult = mult.times(3)
        if (hasUpgrade('e', 13)) mult = mult.times(upgradeEffect('e', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.80)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Begin",
            description: "You recently found the Modding Tree, and as you open GitHub... the adventure begins...",
            cost: new Decimal (1)
        },
        12: {
            title: "New Idea",
            description: "You have an idea for your first game, and you start coding.",
            cost: new Decimal (2),
        },
        13: {
            title: "Creativity Motivation",
            description: "The more progress you make into your game, the faster you code!",
            cost: new Decimal (4),
            effect() {
                if (hasUpgrade('e', 23)) return player.e.points.add(1).pow(0.85)
                if (inChallenge('t', 11)) return new Decimal(1)
                else
                return player[this.layer].points.add(2).pow(0.45)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Prestigious Momentum",
            description: "The faster you code, you make a lot more progress!",
            cost: new Decimal (5),
            effect() {
                if (inChallenge('t', 11)) return new Decimal(1)
                else
                return player.points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "Several Issues",
            description: "A lot of errors happen as you try out the codes that you received at Discord.",
            cost: new Decimal (60),
            unlocked() {
                if (hasUpgrade('e', 14)) return true
                else
                return false
            }
        },
        22: {
            title: "Desperate Attempts",
            description: "Your code fails a lot no matter how you try.",
            cost: new Decimal(80),
            effect() {
                if (hasUpgrade('e', 22)) return player.points.add(1).pow(0.55)
                else
                return player.points.add(1).pow(0.45)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                if (hasUpgrade('e', 14)) return true
                else
                return false
            },
        },
        23: {
            title: "Inflation Problems",
            description: "You have to avoid your own game be broken by a way too powerful upgrade!",
            cost: new Decimal(230),
            effect() {
                if (hasChallenge('t', 12)) return player.e.points.add(1).pow(0.2)
                if (inChallenge('t', 11)) return player.e.points.add(1).pow(0.995).min(50.00)
                if (hasUpgrade('t', 23)) return player.e.points.add(1).pow(0.995).min(700)
                else
                return player.e.points.add(1).pow(0.995).min(new Decimal (90.00))
            },
            effectDisplay() { return format(upgradeEffect('p', 23))+"x"},
            unlocked() {
                if (hasUpgrade('e', 14)) return true
                else
                return false
            }
        },
        24: {
            title: "Giving Up",
            description: "You feel like you're not making any progress now, so you start yet another game.",
            cost: new Decimal(2500),
            unlocked() {
                if (hasUpgrade('e', 14)) return true
                else
                return false
            },        
        },
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.p.row) {
            // the three lines here
            let keep = []
        if (hasUpgrade('e', 12)) keep.push("upgrades")
        if (hasMilestone('t', 2)) keep.push('p'.points)
        layerDataReset('p', keep) 
        }    
    },
    passiveGeneration() {
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
            title: "Milestone Problem",
            description: "As you try to add milestones, you fail.",
            cost: new Decimal (1),
        },
        12: {
            title: "Trash Your Game",
            description: "You give up on your first game, and you decide to start again.",
            cost: new Decimal (2),
        },
        13: {
            title: "A Theme",
            description: "You set a theme for your second game, which you think it's going to succeed. You get a bonus at Prestige gain.",
            cost: new Decimal (3),
            effect() {
                return player.points.add(1).pow(0.13).min(197.84)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Ask for Help at Discord",
            description: "You open Discord and ask for help there, EVERYTHING.",
            cost: new Decimal (5)
        },
        21: {
            title: "Impossible Goals",
            description: "Frustrated, you think you're never going to succeed at your own mod.",
            cost: new Decimal (5e14),
            effect() {
                return player.p.points.add(2).pow(0.55).min(300)
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
            cost: new Decimal (8e15),
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            },
        },
        23: {
            title: "Re-thinking",
            description: "'I guess I can just relax and take it chill' Upgrade 2;3 is buffed.",
            cost: new Decimal (2e16),
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            },
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
        if (hasMilestone('t', 3)) keep.push('e'.points)
        layerDataReset('e', keep) 
        }    
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

    baseResource: "prestige points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e20),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.45,                         // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1.00)            // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.15)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
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
            effectDescription: "Keep Prestige Points on experience resets.",
            done() {
                return player.t.points.gte(4)
            },
        },
        3: {
            requirementDescription: "100 thoughts",
            effectDescription: "Keep Experience upon reset.",
            done() {
                return player.t.points.gte(100)
            },
        },
    },
    hotkeys: [
        {key: "t", description: "T: Reset for thoughts.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    challenges: {
        11: {
            name: "'You won't make it'",
            challengeDescription: "The first row of Prestige Upgrades is disabled and the Prestige 2;3 upgrade (Inflation Problems) is nerfed.",
            goalDescription: "500,000 Prestige Points.",
            rewardDescription: "Unlock a new row of Experience Upgrades.",
            canComplete: function() {return player.p.points.gte(500000)},
            unlocked() {
                if (hasMilestone('t', 1)) return true
                else 
                return false
            },
        },
        12: {
            name: "'Just give up'",
            challengeDescription: "Prestige Points are much harder to earn.",
            goalDescription: "1e15 Prestige Points.",
            rewardDescription: "The Prestige 2;3 Upgrade is far less powerful, but has no hardcap.",
            canComplete: function() {return player.p.points.gte(1e15)},
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            }
        },
    },
})