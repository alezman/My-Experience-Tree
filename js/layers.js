addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        effect1: new Decimal(2),
        cost1: new Decimal(10),
        level1: new Decimal(0),
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
        mult = mult.times(layers.t.effect())
        if (player.li.level1 > 1) mult = mult.times(clickableEffect('li', 11)).add(player.li.level1)
        if (hasUpgrade('e', 15)) mult = mult.pow(1.5)
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
            cost: new Decimal (1),
            effect() {
                if (inChallenge('t', 21)) return new Decimal (0.0001)
                if (hasChallenge('t', 21)) return new Decimal (1e5)
                else
                return new Decimal (1)
            },
        },
        12: {
            title: "New Idea",
            description: "You have an idea for your first game, and you start coding.",
            cost: new Decimal (2),
            effect() {
                if (inChallenge('t', 21)) return new Decimal (2)
                if (hasChallenge('t', 21)) return new Decimal (1e6)
                else
                return new Decimal (5)
            },
            unlocked() {
                if (hasUpgrade('p', 11)) return true
                else return false
            }
        },
        13: {
            title: "Creativity Motivation",
            description: "You feel motivated by your own progress.",
            cost: new Decimal (4),
            effect() {
                if (hasUpgrade('e', 23)) return player.e.points.add(1).pow(0.85)
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
            description: "The faster you code, you make a lot more progress!",
            cost: new Decimal (5),
            effect() {
                if (inChallenge('t', 11)) return new Decimal(1)
                else
                return player.points.add(1).pow(0.3)
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
            description: "A lot of errors happen as you try out the codes that you received at Discord.",
            cost: new Decimal (200),
            unlocked() {
                if (hasUpgrade('e', 14)) return true
                else
                return false
            }
        },
        22: {
            title: "Desperate Attempts",
            description: "Your code fails a lot no matter how you try.",
            cost: new Decimal(350),
            effect() {
                if (hasUpgrade('e', 22)) return player.points.add(1).pow(0.55)
                else
                return player.points.add(1).pow(0.45)
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
            description: "You have to avoid your own game be broken by a way too powerful upgrade!",
            cost: new Decimal(730),
            effect() {
                if (hasChallenge('t', 12)) return player.e.points.add(1).pow(0.25)
                if (inChallenge('t', 11)) return player.e.points.add(1).pow(0.05)
                if (hasUpgrade('e', 23)) return player.e.points.add(1).pow(0.2)
                else
                return player.e.points.add(1).pow(0.9995).min(530)
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
            description: "You feel like you're not making any progress now, so you start yet another game.",
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
        if (hasUpgrade('e', 12)) keep.push("upgrades")
        if (hasMilestone('t', 2)) keep.push(p.points)
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
            description: "You got an idea for a new theme, for your new game. More P.Point production.",
            cost: new Decimal (3),
            effect() {
                return player.points.add(1).pow(0.12)
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
            description: "You feel like you're not doing well at your own mod.",
            cost: new Decimal (5e11),
            effect() {
                return player.p.points.add(2).pow(0.25)
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
            description: "'I guess I can just relax and take it chill' Upgrade 2;3 is buffed.",
            cost: new Decimal (1e20),
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            },
        },
        24: {
            title: "Back at it",
            description: "You're back at your GitHub project, and you decide you should make a powerful upgrade.",
            cost: new Decimal (1e30),
            effect() {
                return player.t.points.add(1).pow(0.5)
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
            description: "You feel better as you relax and take it easy. Prestige Point and Point gain are raised to the 1.4th power.",
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
        if (hasUpgrade('li', 11)) return new Decimal(0.45)
        else
        return new Decimal(0.2)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
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
            effectDescription: "Keep Prestige Points on experience resets.",
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
            name: "'Just give up!'",
            challengeDescription: "Prestige Points are much harder to earn.",
            goalDescription: "1e15 Prestige Points.",
            rewardDescription: "The Prestige 2;3 Upgrade is more powerful.",
            canComplete: function() {return player.p.points.gte(1e15)},
            unlocked() {
                if (hasChallenge('t', 11)) return true
                else
                return false
            }
        },
        21: {
            name: "'It's impossible!'",
            challengeDescription: "'Start' and 'New Ideas' are far less powerful.",
            goalDescription: "100,000 experience.",
            rewardDescription: "'Start' and 'New Ideas' are superbuffed.",
            canComplete: function() { return player.e.points.gte(100000)},
            unlocked() {
                if (hasChallenge('t', 12)) return true
                else
                return false
            },
        },
    },
    tabFormat: {
        "Main Tab": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function() {
                        return "You have " +format(player.p.points)+ " prestige points."
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
        return "granting a " +format(layers.t.effect())+ "x bonus to point and prestige point production."
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

    requires: new Decimal(1e100),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    branches: ['p'],
    upgrades: {
        11: {
            title: "Motivation. Again.",
            description: "You're happy to know your mod is succeeding.",
            cost: new Decimal(2),
            effect() {
                return player.e.points.add(1).pow(0.25)
            },
            effectDisplay() {
                return format(upgradeEffect('li', 11))+"x"
            },
        },
    },
    clickables: {
        11: {
            title: "Motivation Synergy",
            display() {return "Multiplier to P.Point and Point gain"+ format(clickableEffect('li', 11))+"x. Cost: " + format(player.li.cost1) + " Lesser Ideas"},
            canClick(){return player.points.gte(format(player.li.cost1))},
            onClick() {player.points = player.points.minus(format(player.li.cost1)) 

                player.li.level1=player.li.level1.add(1)
            player.li.cost1 = player.li.cost1.add(5).times(1.5)}
            },
            effect() {
                return new Decimal(50)
            }
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
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e120),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.6,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.85)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    branches:['li'],
       
})
addLayer("h", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#FA0202",                       // The color for this layer, which affects many elements.
    resource: "help and support",            // The name of this layer's main prestige resource.
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
        if (hasUpgrade('e', 25)) return true
        else return false
    },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
        11: {
            title: "Discord Support",
            description: "Your questions are more precise, and people understand you. 9x to P.Point production.",
            cost: new Decimal(1),
            effect() {
                return new Decimal (9)
            },
        },
        12: {
            title: "Less Issues",
            description: "You now know the basics of JS, and soon will finish your game. 99x to Point production.",
            cost: new Decimal(2),
            effect() {
                return new Decimal(99)
            },
        },
        13: {
            title: "Gaining Trust",
            description: "More and more people answer your questions, as you're finishing your game.",
            cost: new Decimal(3),
        },
        14: {
            title: "Last Layer",
            description: "You're making your last layer of the game.",
            cost: new Decimal(3),
            effect() {
                return player.e.points.add(1).pow(0.25)
            },
            effectDisplay() {
                return format(upgradeEffect('h', 14))
            },
        }
    }
})