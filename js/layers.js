/*
// THIS IS THE BASE LAYER EXAMPLE, USE THIS!
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
*/
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "gwa", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource() {
        if (player.p.points.eq(1)) return "gwa producer"
        return "gwa producers"
    }, // Name of prestige currency
    baseResource: "gwa(s)", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    image: "gwa.png",
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "g: Sacrifice a few gwas for a gwa producer.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Initialize",
            description: "Grants a base 1 gwa/s production.",
            cost: new Decimal(1),
            currencyDisplayName: "gwa producer",
        },
        12: {
            title: "Efficiency Up",
            description: "Your best gwa producers make extra gwa/s.",
            cost: new Decimal(2),
            effect() {
                let x = player.p.best.add(1).log(3).add(1)
                if (hasUpgrade('p',13)) x = x.mul(upgradeEffect('p',13))
                return x
            },
            effectDisplay() {
                if (hasUpgrade('p',13)) return "+"+formatWhole(upgradeEffect('p',12).div(upgradeEffect('p',13)))+"("+formatWhole(upgradeEffect('p',13))+"x)"+"/s"
                return "+"+formatWhole(upgradeEffect('p',12))+"/s"
            },
            currencyDisplayName: "gwa producers",
        },
        13: {
            title: "Laboratories",
            description: "Your gwas can help improve your producers at a low rate.",
            cost: new Decimal(7),
            effect() {
                let x = player.points.add(1).log(10).add(1).pow(0.8)
                return x
            },
            effectDisplay() {
                return formatWhole(upgradeEffect('p',13))+"x"
            },
            currencyDisplayName: "gwa producers",
        },
        14: {
            title: "Shelters",
            description: "Your gwas directly improve their production at a low rate.",
            cost: new Decimal(10),
            effect() {
                let x = player.points.add(1).log(20).add(1).log(3).add(1)
                return x
            },
            effectDisplay() {
                return formatWhole(upgradeEffect('p',14))+"x"
            },
            currencyDisplayName: "gwa producers",
        }
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.p.row) {
            // the three lines here
            let keep = []
            let specialUpgs = [11]
            if (resettingLayer == 's' && hasMilestone('s', 0)) specialUpgs.push("upgrades")
            layerDataReset('p', keep)
            for(i in specialUpgs) {
                if (!player[this.layer].upgrades.includes(specialUpgs[i])) {
                player[this.layer].upgrades.push(specialUpgs[i])
                }
            } 
        }
    },
})

// shelters
addLayer("s", {
    name: "prestigezz", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        gwappiness: new Decimal(0),
    }},
    color: "#4C3100",
    requires: new Decimal(50), // Can be a function that takes requirement increases into account
    resource() {
        if (player.s.points.eq(1)) return "shelter"
        return "shelters"
    }, // Name of prestige currency
    baseResource: "gwa producer(s)", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.062858, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('s',12)) mult = mult.mul(upgradeEffect('s',12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ['p'],
    hotkeys: [
        {key: "s", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('p',13) || player.s.total.gte(1)},
    tabFormat:[
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text", () => "You have " + formatWhole(player.s.gwappiness) + " gwa happiness, which is directly multiplying gwa production by " + formatWhole(temp.s.effect) + "x."],
        ["display-text", () => "<h5 style='opacity:0.5'>You're generating " + formatWhole(temp.s.gwappinessRate) + " gwa happiness/s"],
        "blank",
        "upgrades",
    ],
    effect() {
        let x = player.s.gwappiness.add(1).log(5).add(1).mul(player.s.points.add(1).log(20).add(1).log(5).add(1))
        if (hasUpgrade('s',11)) x = x.mul(upgradeEffect('s',11))
        return x
    },
    update(diff) {
        player.s.gwappiness = player.s.gwappiness.add(temp.s.gwappinessRate.times(diff))
    },
    gwappinessRate() {
        let x = new Decimal(2).pow(player.s.points.sub(1))
        return x
    },
    upgrades: {
        11: {
            title: "Bigger Shelters",
            description() {return "The gwappiness gets a minor boost, which is " + format(upgradeEffect('s',11)) + "x, based on best shelters."},
            cost: new Decimal(3),
            effect() {
                let x = player.s.best.add(1).log(10).add(1).pow(0.85).add(1)
                return x
            },
            currencyDisplayName: "shelters",
        },
        12: {
            title: "gwa Builders",
            description() {return "Boost shelter gain by " + formatWhole(upgradeEffect('s',12)) + "x."},
            cost: new Decimal(4),
            effect() {
                let x = player.points.add(1).log(30).add(1).pow(0.75).add(1)
                return x
            },
            currencyDisplayName: "shelters",
        },
        13: {
            title: "THE Boost",
            description() {return "gwa production is raised to the 1.4th power."},
            cost: new Decimal(10),
            effect() {
                let x = new Decimal(1.4)
                return x
            },
            currencyDisplayName: "shelters",
        }
    },
    milestones: {
        0: {
            requirementDescription: "5 shelters",
            effectDescription: "Always keep the 1st gwa producer upgrade (on this layer)",
            done() { return player.s.points.gte(5) }
        },
        1: {
            requirementDescription: "7 shelters",
            effectDescription: "Start with 250 gwas instead of 10.",
            done() { return player.s.points.gte(7)}
        }
    }
})

// lore'th
addLayer("l", {
    name: "lore'th", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#8A008F",
    requires: new Decimal("eeeeeeeeeeeee9999999999999999"), // Can be a function that takes requirement increases into account
    resource: "none", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    tooltip: "Lore",
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat:[
        ["infobox", "lore"],
        function() {
            if (player.s.unlocked == true) return ["infobox", "lore2a"]
        }
    ],
    infoboxes: {
        lore: {
            title: "Chapter 1. Initialize.",
            body() { return "Welcome to the gwacremental tree! Your mission in this game is to get as much gwas as possible. They lived here thousands of milennia ago, but then, a sudden explosion killed them all but two. Those two had a very large bloodline, but weren't able to keep up.<br><br>Your ancestors, one by one, tried to find a faster way to make gwas. They created the 'gwa makers', which were really unefficient. The gwas died faster than they were being made, and so it all went downhill until you were born.<br><br>You used your ancestors' way to produce gwas, and so, you start experimenting around it and trying find upgrades for that little invention that could save the gwakind. You succesfully made something good! You decided to call it 'gwa producer', and it really works! gwa production is higher than gwa death rate now! <br><br>However, you still need to know, to make gwa producers you need to sacrifice a few gwas onto it, and if you try to make several gwa producers in a row, it'll take you more gwas to work with you. <br><br>Will you accept the challenge and continue your way to success?" },
        },
        lore2a: {
            title: "Chapter 2-A. Shelters.",
            body() { return "Seeing your gwa producers, you thought you were really making progress. However, it just wasn't enough! You thought that maybe the gwas themselves could help with the production. You built your first shelter, hoping for any gwa to find it and make another gwa. And it succeeded! You made it, and now gwa production is mainly because of these gwas. It is now up to you for you to continue and and make this even more efficient!" }
        }
    },
})