let modInfo = {
	name: "My Experience Tree",
	id: "ilearntjscodesmh",
	author: "alez",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (5), // Used for hard resets and new players
	offlineLimit: 1000,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.4",
	name: "Support",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0</h3><br>
		- Added Prestige Upgrades.<br>
		- Released the game.<br>
		- Accidentally released a game-breaking upgrade<br>
		<br><h3>v1.1</h3><br>
		- Fixed the game-breaking upgrade adding a hardcap.<br>
		<br><h3>v1.2</h3><br>
		- Added Thoughts, and added two challenges.<br>
		- More Upgrades!<br>
		<br><h3>v1.3</h3><br>
		- Added Ideas and Lesser Ideas. <br>
		- Added a new powerful upgrade. <br>
		- Fixed some glitches and bugs. <br>
		<br><h3>v1.4</h3><br>
		- Added the last layer <br>
		- Added the final upgrades. <br>
		- lol ez finished the game <br>
		- tell me if any bugs smh`

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

	let gain = new Decimal(0)
	if (hasUpgrade('p', 11)) gain = gain.add(upgradeEffect('p', 11))
	if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12))
	if (hasUpgrade('p', 13)) gain = gain.times(upgradeEffect('p', 13))
	if (hasUpgrade('p', 22)) gain = gain.times(upgradeEffect('p', 22))
	if (hasUpgrade('p', 23)) gain = gain.times(upgradeEffect('p', 23))
	if (inChallenge('t', 11)) gain = gain.times(0.2)
	if (hasChallenge('t', 11)) gain = gain.times(3)
	if (hasUpgrade('e', 24)) gain = gain.times(upgradeEffect('e', 24))
	gain = gain.times(layers.t.effect())
	if (player.li.level1 > 1) gain = gain.times(clickableEffect('li', 11)).add(player.li.level1)
	if (hasUpgrade('e', 15)) gain = gain.pow(1.5)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Reach 1.79e308 points to finish the game!"
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1.797693143e308"))
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