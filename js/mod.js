let modInfo = {
	name: "My Experience Tree Rebuilt",
	id: "fullreset2",
	author: "alez",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "alez's server",
	discordLink: "",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "2.0",
	name: "Rebuild Pt.1",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0</h3><br>
	<h6>The Release</h6>
		- Added Prestige Upgrades.<br>
		- Released the game.<br>
		- Accidentally released a game-breaking upgrade<br>
		<br><h3>v1.1</h3><br>
		<h6>Anti-Inflation</h6>
		- Fixed the game-breaking upgrade adding a hardcap.<br>
		<br><h3>v1.2</h3><br>
		<h6>Evil Thoughts</h6>
		- Added Thoughts, and added two challenges.<br>
		- More Upgrades!<br>
		<br><h3>v1.3</h3><br>
		<h6>Ideas...</h6>
		- Added Ideas and Lesser Ideas. <br>
		- Added a new powerful upgrade. <br>
		- Fixed some glitches and bugs. <br>
		<br><h3>v1.4</h3><br>
		<h6>The End?</h6>
		- Added the last layer <br>
		- Added the final upgrades. <br>
		<br><h3><b>v1.5</b></h3><br>
		<h6>Huge Fixes</h6>
		- Changed a lot of Upgrade Descriptions, and nerfed the game overall. <h5>(Sorry, lore will soon be re-added in another tab.)</h5>
		- Upgrades now use a more balanced formula, and therefore had to lower a lot of requirements.<br>
		- <b>Finally</b> removed the Lesser Ideas' clickable (if you ever managed to see it), and added 2 buyables instead. Also, LI is now a proper row 2 layer.<br>
		- Renamed "Prestige Points" to "Knowledge".<br>
		<br><h3><b>v1.5.1</b></h3>
		<h6>Smaller Fixes</h6>
		- Changed some more descriptions from "Prestige Points" to "Knowledge".<br>
		- Fixed an error in mobile about "unlockOrder", it should be working now.<br>
		- Challenges still had the same high reqs; lowered them so they are now possible.<br>
		- DM me if any errors so I can fix them.<br>
		- Hid 2 layers since they were uncomplete.<br>
		<br><h3><b>1.6</b></h3><br>
		<h6>Upgrade Tree</h6>
		- Re-added a layer previously hidden and finished it.<br>
		- Removed nothingnesses as someone asked me to do so :sob:<br>
		- Thoughts no longer require Knowledge; instead they require Experience and Ideas require Lesser Ideas, however they help each other<br> 
		<br><h3><b>1.6.1</b></h3><br>
		<h6>Improvements</h6>
		- Fixed so many bugs, to the point where I can't count them.<br>
		- Added a milestone<br>.
		<br><h2><b>v2.0</b></h2><br>
		<h6>Rebuild Pt.1</h6>
		- Rebalanced most upgrades
		- ADDED ACHIEVEMENTS, and a currency.
		- ADDED LORE!!! FINALLY!!
		- ADDED GUIDES! Anyways, do you really need guides?
		- ADDED A SUPER HARD CHALLENGE!
		- Rebalanced the endgame, now it is proper.
		- Brrr I thought v1.4 was going to be the end😂😂.`

let winText = `Well, you beat the current endgame, soon there will be more updates.`

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
    if (!hasUpgrade('p',11)) return new Decimal(0)
	let gain = new Decimal(1)
	if (inChallenge('t',22)) gain = gain.pow(0.01)
	if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12))
	if (hasUpgrade('p', 13)) gain = gain.times(upgradeEffect('p', 13))
	if (hasUpgrade('p',14)) gain = gain.times(upgradeEffect('p',14))
	if (hasUpgrade('p', 22)) gain = gain.times(upgradeEffect('p', 22))
	if (hasUpgrade('p', 23)) gain = gain.times(upgradeEffect('p', 23))
	if (inChallenge('t', 11)) gain = gain.times(0.2)
	if (hasChallenge('t', 11)) gain = gain.times(3)
	if (hasUpgrade('e', 24)) gain = gain.times(upgradeEffect('e', 24))
	gain = gain.times(layers.t.effect())
	gain = gain.times(layers.a.effect())
	if (hasUpgrade('e', 15)) gain = gain.pow(1.5)
	if (getBuyableAmount('li',11).gte(1)) gain = gain.times(buyableEffect('li',11))
	if (getBuyableAmount('li',21).gte(1)) gain = gain.times(buyableEffect('li',21))
	if (hasAchievement('a',33)) gain = gain.times(20)
	if (hasAchievement('a',35)) gain = gain.pow(1.2)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Current Endgame: 1e30 Points..."
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("1e30")
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