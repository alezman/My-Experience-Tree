let modInfo = {
	name: "The gwatreemental",
	id: "mymod",
	author: "alez (with the help of jakub#8151 and srotpars#6403)",
	pointsName() {
		if (player.points.lte(0.99)) return "gwas"
		if (player.points.gte(1) && player.points.lte(1.51)) return "gwa"
		return "gwas"
	},
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.11b",
	name: "2nd gwalease",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><h3 style="color:red;"> (beta)</h3><br>
	<h5 style="opacity=0.75">--- The gwalease ---</h5><br>
		- Started developing the game.<br>
		- Is a bit different than normal TMT trees.
		- The tree contains 2 layers by now (05/05/22)
		- (Spoilers; select text to read) <h4 style="background-color:#E8E8E8;">THE 2ND LAYER "shelters" NOW HAS A MAIN FEATURE SUGGESTED</h4> (thanks to srotpars)<br>
	<br><h3>v0.11</h3><h3 style="color:red;"> (beta)</h3><br>
	<h5 style="opacity=0.75">--- The 2nd gwalease ---</h5><br>
	    - Fixed a lot of bugs (thanks jakub)
		- Added milestones to the 2nd layer`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (!hasUpgrade('p',11)) gain = new Decimal(0)
	if (hasUpgrade('p',12)) gain = gain.add(upgradeEffect('p',12))
	if (hasUpgrade('p',14)) gain = gain.mul(upgradeEffect('p',14))
	if (player.s.total.gte(1)) gain = gain.mul(temp.s.effect)
	if (hasUpgrade('s',13)) gain = gain.pow(upgradeEffect('s',13))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {if (player.points.gte(100) && player.points.lte(249)) return "You are making a lot of gwas."
	else if (player.points.gte(250) && player.points.lte(999)) return "The gwas have populated a city."
    else if (player.points.gte(1000) && player.points.lte(9999)) return "There's just a lot of gwas, huh?"
    else if (player.points.gte(10000) && player.points.lte(2499999)) return "The gwas have made a state by now."
    else if (player.points.gte(2500000) && player.points.lte(999999999)) return "The gwas have populated a whole country."
    else if (player.points.gte("1e9") && player.points.lte("9.99e20")) return "Breaking News: gwa creates over " + formatWhole(getPointGen().mul(3600)) + " gwas every hour!"
    else if (player.points.gte("1e21") && player.points.lte("9.99e99")) return "Breaking News: gwa population has discovered over " + formatWhole(player.points.pow(0.092)) + " planets already!"}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}