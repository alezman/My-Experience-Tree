let modInfo = {
	name: "The Tree of Balancing",
	id: "motivation1",
	author: "alez",
	pointsName: "MOTIVATION",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.2",
	name: "Bug Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0</h3><br> (The Release)
		- Created the Forest and the first 3 tasks.<br>
		- Still making the Toolshed.<br><br>
	<h3>v1.1</h3><br> (The Awfulshed)
	    - Created the Tools.
		- The Backpack is still not here though.
	<h3>v1.11</h3><br>
	    - No Offline Time (because MOTIVATION grows too much >:c)<br><br>
	<h3>v1.2</h3> (Timewalln't Gaming)<br>
	    - Added +1 new feature and added all the respective tools.<br>
		- Also, uhm, I really didn't want to do this, but, thanks to some pressure I made MOTIVATION gain a bit more... faster... (whatever!)
		(endgame as of now is having the ▒▒▒▒▒▒ ▒▒▒▒▒)`

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

	let gain = new Decimal(0.1)
	if (player.points.gte(25)) gain = new Decimal(0)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"MOTIVATION is what keeps you playing this game for so long... You gain MOTIVATION at a very slow rate. You also use MOTIVATION for the main features.<br>Uhm, also, MOTIVATION is capped at 25, so you cannot get more... (thanks dlob & downvoid)..."
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