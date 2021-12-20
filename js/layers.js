addLayer("f", {
    name: "forest", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        wood: new Decimal(0),
        rocks: new Decimal(0),
        wAxe: false,
        wPAxe: false,
        backpack: false,
        exploreNumber: new Decimal(0) // This is the amount of times you've used the explore option. It's main purpose is to determine which events you have unlocked.
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "nothing", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    shouldNotify: false,
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat:[
        ["infobox", "tutorial"],
        "blank",
        ["display-text", "<h2>Forest</h2><br>This is the place where you begin your journey."],
        "blank",
        "blank",
        "clickables",
        "blank",
        ["infobox", "inventory"]
    ],
    tooltip: "Forest",
    clickables: {
        11: {
            title: "Cut Wood",
            display() {return "Chop down a tree using some of your MOTIVATION (unless you have an axe) and receive a random amount of wood.<br>Time: "+formatTime(getClickableState("f",11))},
            onClick(){
                setClickableState('f', 11, player.f.wAxe?3:6)
                if (player.f.wAxe == false) player.points = player.points.sub(2)
            },
            canClick() {
                if (player.f.clickables[11] > 0) return false
                if (player.f.wAxe == true) return true
                else if (player.f.wAxe == false && player.points.gte(2)) return true
                else if (player.f.wAxe == false && player.points.lte(1.99)) return false
            },
            onComplete(){
                player.f.wood = player.f.wood.add(Math.floor(Math.random()*3)+1)
            },
            style() { return {
                "min-height": "200px",
                "width" : "200px",
            }}
        },
        12: {
            title: "Grab Rocks",
            display() {return "Grab rocks with your mere hands using some of your MOTIVATION (unless you have a backpack) and receive a random amount of rocks.<br>Time: "+formatTime(getClickableState("f",12))},
            onClick() {
                setClickableState('f', 12, player.f.backpack?2:4)
                if (player.f.backpack == false) player.points = player.points.sub(1)
            },
            canClick() {
                if (player.f.clickables[12] > 0) return false
                if (player.f.backpack == true) return true
                else if (player.f.backpack == false && player.points.gte(1)) return true
                else if (player.f.backpack == false && player.points.lte(0.99)) return false
            },
            onComplete(){
                player.f.rocks = player.f.rocks.add(Math.floor(Math.random()*10)+2)
            },
            style() { return {
                "min-height": "200px",
                "width" : "200px",
            }}            
        },
        13: {
            title: "Explore the Forest",
            display() {return "You can explore the forest, and you might find something appealing! Costs 1 motivation to explore.<br>Time: "+formatTime(getClickableState("f",13))},
            onClick() {
                setClickableState('f', 13, 30)
                player.points = player.points.sub(1)
            },
            canClick() {
                if (player.f.clickables[13] > 0) return false
                if (player.points.gte(1)) return true
                if (player.points.lte(0.99)) return false
            },
            onComplete() {
                player.f.exploreNumber = player.f.exploreNumber.add(1)
            },
            style() { return {
                "min-height": "200px",
                "width" : "200px",
            }}  
        }
    },
    update(diff){
        if(player.f.clickables[11]>0){
            setClickableState('f',11,Math.max(player.f.clickables[11]-diff,0));
        if(player.f.clickables[11]==0){
        layers.f.clickables[11].onComplete()
        }
        }
        if(player.f.clickables[12]>0){
            setClickableState('f',12,Math.max(player.f.clickables[12]-diff,0));
        if(player.f.clickables[12]==0){
        layers.f.clickables[12].onComplete()
        }
        }
        if(player.f.clickables[13]>0){
            setClickableState('f',13,Math.max(player.f.clickables[13]-diff,0));
        if (player.f.clickables[13]==0){
            layers.f.clickables[13].onComplete()
        }
        }
    },
    infoboxes: {
        tutorial: {
            title: "Balancing: Forest",
            body() {
                return "Here is where your journey begins, you have one thing called MOTIVATION, this MOTIVATION is what keeps you playing the game for so long, you can spend MOTIVATION in other things if you don't have the correct tool. In order to prevent timewalls, I myself (alez) put a very slow MOTIVATION gain so in case you run out of MOTIVATION you don't have to reset the game."
            }
        },
        inventory: {
            title: "Your Inventory",
            body() {
                if (player.f.rocks.gte(1)) return "Your inventory is limitless and you can carry as much as you'd like.<br><br>Wood: " + formatWhole(player.f.wood) + "<br>Rocks: " + formatWhole(player.f.rocks)
                return "Your inventory is limitless and you can carry as much as you'd like.<br><br>Wood: " + formatWhole(player.f.wood)
            }
        },
        exploring: {
            title: "Things You've Found",
            body() {
                return "Through exploring, you can discover new things! However, sometimes, you need to have done something first in order to discover it."
            }
        }
    },
})
function pickNumber3() {
   return new Decimal(Math.floor(Math.random() * 3) + 1)
}

addLayer("t", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#4C3100",                       // The color for this layer, which affects many elements.
    resource: "prestige points",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "none",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    tooltip: "Toolshed",
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return player.f.exploreNumber.gte(4) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
})