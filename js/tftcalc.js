// $Id: tftcalc.js,v 1.2 2020/05/14 15:37:08 hcobb Exp $
//     <p>The Fantasy Trip(t.m.) is a trademark of Steve Jackson Games, and their rules and art are copyrighted by Steve Jackson Games. All rights are reserved by Steve Jackson Games.<br>
// This game aid is the original creation of <a href="http://www.hcobb.com/">Henry J. Cobb</a> and is released for free distribution, and not for resale, under the permissions granted in the <a href="http://www.sjgames.com/general/online_policy.html">Steve Jackson Games Online Policy</a>.</p>

function load_options(f,opts) {
    f.style.display = 'none';
  let len = f.options.length;
  for (let i = len-1; i >= 0; i--) {
    f.options[i] = null;
  }
  let listed = 0;
  for(k in opts) {
    listed++;
    let opt = document.createElement("option");
    opt.text = k;
    opt.value = k;
    f.add(opt,null);
  }
  if(1 < listed) f.style.display = 'inline';
}

function rand_lang() {return "Common";}

var races = {
  Centaur: [14,28,10,20,8,20,2,"12/24",2,"Kick(+1d)","",["Centaur"],78,-20,4,1.0],
  "Deep elf": [6,18,10,30,8,24,8,"12","M","","-4 DX on land",["Sea Elvish"],77,-5,6,0.5],
  Dwarf: [10,30,6,18,8,24,8,"10","M","","",["Dwarvish"],77,2,5,0.5],
  Elf: [6,18,10,30,8,24,8,"12","M","","",["Elvish"],77,-1,5,0.5],
  Gargoyle: [13,24,11,16,8,10,0,"8/16","L","Stony hands","Stony skin (3)",["Gargoyle"],79,-20,3,1.0],
  "Half-dwarf": [9,25,7,20,8,24,8,"10","M","","",["Common"],77,2,5,0.5],
  "Half-elf": [7,20,9,24,8,24,8,"10","M","","",["Common"],77,-1,5,0.5],
  "Half-giant": [16,24,9,12,7,10,0,10,2,"","",["Common"],78,-20,3,1.0],
  "Half-goblin": [7,14,7,20,9,24,8,10,"S","","",["Goblin"],77,-1,6,0.67],
  "Half-orc": [8,24,8,24,8,24,8,10,"M","","",["Orcish"],77,0,5,1.0],
  Halfling: [4,12,12,24,8,24,6,10,"S","","-2 to be attack or be attacked by multihex",["Thrown Weapons","Common"],78,-2,5,0.5],
  Hobgoblin: [7,15,6,18,7,11,8,10,"S","","",["Goblin"],78,-2,4,0.5],
  Human: [8,24,8,24,8,24,8,10,"M","","",["Common"],77,0,5,1.0],
  Giant: [25,40,9,10,7,10,0,10,3,"","",["Giant"],78,-20,3,1.0],
  Goblin: [6,12,8,24,10,30,8,10,"S","","",["Goblin"],77,-1,6,0.67],
  "Merfolk": [8,24,8,24,8,24,8,10,"M","","-4 DX on land",["Merfolk"],79,-5,5,1.0],
  Orc: [8,24,8,24,8,24,8,10,"M","","",["Orcish"],77,0,5,1.0],
  "Orcling": [6,16,10,24,8,24,7,10,"S","","",["Common"],78,-2,5,0.5],
  Prootwaddle: [10,20,10,20,7,7,0,10,"S","","",["Common"],78,-4,0,1.0],
  "Reptile Person": [12,24,8,24,8,16,4,10,"L","Claws (+2; doubled in HTH), Tail (1d)","",["Reptile Person"],79,-2,4,1.0],
  Shadowight: [5,17,8,24,8,24,5,10,"M","","Light and dark reversed",["Shadowight"],82,-1,5,0.5]
};

var sub_race = {
  "Reptile Man" : "Reptile Person",
  "Merman" : "Merfolk",
  "Mermaid" : "Merfolk",
  "Half-halfling" : "Orcling"
};

var raceMatch = /^(.*)(Centaur|Deep Elf|Dwarf|Half-Dwarf|Half-elf|Elf|Gargoyle|Halfling|Orcling|Hobgoblin|Human|Giant|Half-Giant|Goblin|Half-Goblin|Merfolk|Orc|Half-orc|Prootwaddle|Reptile Man|Reptile Person|Shadowight)(.*)$/si;
    
class Race {
  constructor(str) {
    this.error = "";
    this.name = str.trim();
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    if(this.name in races) {
      this.row = races[this.name];
    } else {
      this.name = 'Human';
      this.row = races[this.name];
    }
  }
  size() {return this.row[8];}
  MA(adj) {
    let ary = ("" + this.row[7]).split("/");
    for(let i = 0; i < ary.length; i++) {ary[i] -= -adj;}
    return ary.join("/");
  }
};

function APXP(AP,base) {
  if(AP <= base) {return 0;}
  let clip = AP;
  if(34 < clip) clip = 34;
  let XP = 100 * (clip - base);
if(AP < 35) return XP;
XP += 200;
if(AP < 36) return XP;
XP += 300;
if(AP < 37) return XP;
XP += 600;
if(AP < 38) return XP;
let step = 500;
for(i = 38; i <= AP; i++) {
step *= 2;
XP += step;
}
return XP;
}


// $Id: talents.js,v 1.4 2020/05/14 15:36:46 hcobb Exp hcobb $
//     <p>The Fantasy Trip(t.m.) is a trademark of Steve Jackson Games, and their rules and art are copyrighted by Steve Jackson Games. All rights are reserved by Steve Jackson Games.<br>
// This game aid is the original creation of <a href="http://www.hcobb.com/">Henry J. Cobb</a> and is released for free distribution, and not for resale, under the permissions granted in the <a href="http://www.sjgames.com/general/online_policy.html">Steve Jackson Games Online Policy</a>.</p>

var talent_type = {
  A:"Adventure",
  C:"Combat",
  E:"Entertainment",
  F:"Farming",
  L:"Language",
  M:"Missile",
  N:"Noble",
  R:"Ranch",
  S:"Skilled trades",
  T:"Transport",
  U:"Nature",
  W:"Weapons"
};

var trim_talents = /.*(Master|Fencer|Expert|Missile Weapons|Theologian|Toughness|Unarmed Combat|Missile Weapons|Streetwise).*/

var sub_talents = {
  "Alchemist" : "Alchemy",
  "Ax/Mace" : "Axe/Mace",
  "Chemistry" : "Chemist",
  "Dwarven" : "Dwarvish",
  "Elven" : "Elvish",
  "Goblin tongue" : "Goblin",
  "Human tongue" : "Common",
  "Medic" : "Physicker",
  "Merchant" : "Business Sense",
  "Riding" : "Horsemanship",
  "Sorcerer’s Tongue" : "Sorcerers’ Tongue",
  "Sorcerers' Tongue" : "Sorcerers’ Tongue",
  "Sorcerers Tongue" : "Sorcerers’ Tongue",
  "Toughness I" : "Toughness",
  "Yeti speech" : "Yeti"
};

var sub_spells = {
  "Glamour" : "Glamor",
  "Ironflesh" : "Iron Flesh",
  "Lesser Magic Item Enchantment" : "Lesser Magic Item Creation",
  "Spellshield" : "Spell Shield",
  "Wizard's Wrath" : "Wizard’s Wrath"
}

// Name, 0:minST, 1:minDX, 2:minIQ, 3:Hero cost, 4:Wizard cost, 5:requirement, 6:type
var talents = {};
talents["Acrobatics"] = [0,12,10,2,4,"","AE"];
talents["Acute Hearing"] = [0,0,9,2,4,"","AC"];
talents["Administrator"] = [0,0,9,2,4,"Literacy","NS"];
talents["Alchemy"] = [0,0,14,3,3,"","S"];
talents["Alertness"] = [0,0,9,2,4,"","AC"];
talents["Animal Handler"] = [0,0,9,2,4,"","FRTU"];
talents["Architect/Builder"] = [0,0,11,1,2,"","S"];
talents["Area Knowledge"] = [0,0,8,1,2,"","NS"];
talents["Armourer"] = [0,0,10,1,2,"","S"];
talents["Artist"] = [0,0,10,3,6,"","S"];
talents["Assess Value"] = [0,0,12,1,2,"Recognize Value","NS"];
talents["Astrologer"] = [0,0,12,3,6,"Literacy","NS"];
talents["Axe/Mace"] = [9,8,7,2,4,"","W"];
talents["Axe/Mace Expertise"] = [0,12,11,3,6,"Axe/Mace","C"];
talents["Axe/Mace Mastery"] = [0,14,13,3,6,"Axe/Mace Expertise","C"];
talents["Baker"] = [0,0,8,2,4,"","S"];
talents["Bard"] = [0,0,9,2,4,"","E"];
talents["Beekeeper"] = [0,0,8,1,2,"","F"];
talents["Blowgun"] = [0,0,8,1,2,"","MW"];
talents["Boating"] = [0,0,8,1,2,"","T"];
talents["Bola"] = [9,0,8,1,2,"Thrown Weapons","MW"];
talents["Boomerang"] = [11,0,8,1,2,"Thrown Weapons","MW"];
talents["Bow"] = [0,0,7,2,4,"","MW"];
talents["Brawling"] = [0,0,7,1,2,"","C"];
talents["Brewer"] = [0,0,8,2,4,"","FS"];
talents["Business Sense"] = [0,0,10,2,4,"","S"];
talents["Butcher"] = [0,0,8,1,2,"","FRS"];
talents["Calligrapher"] = [0,0,10,3,6,"Literacy","S"];
talents["Captain"] = [0,0,12,2,4,"Seamanship","TS"];
talents["Carousing"] = [0,0,7,1,2,"","A"];
talents["Carpenter"] = [0,0,8,1,2,"","S"];
talents["Cestus"] = [0,0,8,1,2,"","C"];
talents["Charisma"] = [0,0,9,2,4,"","NSE"];
talents["Cheesemaker"] = [0,0,8,2,4,"","FS"];
talents["Chemist"] = [0,0,13,3,6,"","S"];
talents["Climbing"] = [0,0,9,1,2,"","A"];
talents["Cook"] = [0,0,8,2,4,"","FRS"];
talents["Courtly Graces"] = [0,0,11,1,2,"","N"];
talents["Crossbow"] = [8,0,7,1,2,"","MW"];
talents["Dagger Expertise"] = [0,12,11,3,6,"Knife","C"];
talents["Dagger Mastery"] = [0,14,13,3,6,"Dagger Expertise","C"];
talents["Dancer"] = [0,10,8,1,2,"","E"];
talents["Detect Lies"] = [0,0,11,2,4,"","N"];
talents["Detect Traps"] = [0,0,9,2,4,"","A"];
talents["Diplomacy"] = [0,0,10,1,2,"","N"];
talents["Disguise"] = [0,0,14,2,4,"","A"];
talents["Diving"] = [0,0,9,1,2,"Swimming","AT"];
talents["Draper"] = [0,0,8,1,2,"","S"];
talents["Driver"] = [0,0,9,1,2,"","FRT"];
talents["Engineer"] = [0,0,10,2,4,"","S"];
talents["Escape Artist"] = [0,0,12,2,4,"Pickpocket","AS"];
talents["Expert Horsemanship"] = [0,0,11,2,4,"Horsemanship","AT"];
talents["Expert Naturalist"] = [0,0,12,2,4,"Naturalist","U"];
talents["Farmer"] = [0,0,8,1,2,"","F"];
talents["Fencer"] = [0,12,11,3,6,"Sword","NC"];
talents["Fisherman"] = [0,0,8,1,2,"","S"];
talents["Gardener"] = [0,0,8,1,2,"","F"];
talents["Goldsmith"] = [0,0,11,2,4,"Recognize Value","S"];
talents["Guns"] = [0,8,8,2,4,"","MW"];
talents["Handyman"] = [0,0,8,1,2,"","S"];
talents["Herald"] = [0,0,9,2,4,"Courtly Graces","S"];
talents["Horsemanship"] = [0,0,8,1,2,"","AFNRT"];
talents["Jeweler"] = [0,0,8,2,4,"Recognize Value","S"];
talents["Joiner"] = [0,0,8,2,4,"","S"];
talents["Knife"] = [0,0,7,1,2,"","W"];
talents["Lasso"] = [8,0,8,1,2,"","FMRW"];
talents["Lawyer"] = [0,0,12,3,6,"Literacy","NS"];
talents["Leatherworker"] = [0,0,8,2,4,"","RS"];
talents["Literacy"] = [0,0,8,1,1,"","NS"];
talents["Locksmith"] = [0,0,11,1,2,"","AS"];
talents["Master Administrator"] = [0,0,8,3,6,"-Administrator","NS"];
talents["Master Armourer"] = [0,0,12,2,4,"Armourer","S"];
talents["Master Baker"] = [0,0,8,3,6,"-Baker","S"];
talents["Master Bard"] = [0,0,14,2,4,"Bard","S"];
talents["Master Beekeeper"] = [0,0,8,3,6,"-Beekeeper","FS"];
talents["Master Brewer"] = [0,0,8,3,6,"-Brewer","S"];
talents["Master Butcher"] = [0,0,8,3,6,"-Butcher","S"];
talents["Master Carpenter"] = [0,0,8,3,6,"-Carpenter","S"];
talents["Master Cook"] = [0,0,8,3,6,"-Cook","S"];
talents["Master Dancer"] = [0,12,8,3,6,"-Dancer","SE"];
talents["Master Draper"] = [0,0,8,3,6,"-Draper","S"];
talents["Master Farmer"] = [0,0,8,3,6,"-Farmer","F"];
talents["Master Fencer"] = [0,14,13,3,6,"Fencer","NS"];
talents["Master Fisherman"] = [0,0,8,3,6,"-Fisherman","S"];
talents["Master Gardener"] = [0,0,8,3,6,"-Gardener","F"];
talents["Master Handyman"] = [0,0,8,3,6,"-Handyman","S"];
talents["Master Herald"] = [0,0,8,3,6,"-Herald","S"];
talents["Master Jeweler"] = [0,0,12,3,6,"-Jeweler","S"];
talents["Master Joiner"] = [0,0,8,3,6,"-Joiner","S"];
talents["Master Leatherworker"] = [0,0,8,3,6,"-Leatherworker","S"];
talents["Master Locksmith"] = [0,13,12,1,2,"Locksmith","AS"];
talents["Master Mechanician"] = [0,0,13,2,4,"Mechanician","AS"];
talents["Master Miner"] = [0,0,8,3,6,"-Miner","S"];
talents["Master Physicker"] = [0,0,14,2,4,"Physicker","S"];
talents["Master Pickpocket"] = [0,14,11,1,2,"Pickpocket","AS"];
talents["Master Potter"] = [0,0,8,3,6,"-Potter","S"];
talents["Master Scribe"] = [0,0,8,3,6,"-Scribe","S"];
talents["Master Sculptor"] = [0,0,8,3,6,"-Sculptor","S"];
talents["Master Tailor"] = [0,0,8,3,6,"-Tailor","S"];
talents["Master Tanner"] = [0,0,8,3,6,"-Tanner","S"];
talents["Master Vintner"] = [0,0,8,3,6,"-Vintner","S"];
talents["Master Weaver"] = [0,0,8,3,6,"-Weaver","S"];
talents["Master Woodcarver"] = [0,0,8,3,6,"-Woodcarver","S"];
talents["Mathematician"] = [0,0,13,2,2,"Literacy","S"];
talents["Mechanician"] = [0,0,11,2,4,"","S"];
talents["Mimic"] = [0,0,10,1,2,"","SE"];
talents["Miner"] = [0,0,8,1,2,"","S"];
talents["Missile Weapons"] = [0,0,9,1,2,"","MC"];
talents["Missile Weapons II"] = [0,0,9,1,2,"Missile Weapons","MC"];
talents["Missile Weapons III"] = [0,0,9,1,2,"Missile Weapons II","MC"];
talents["Musician"] = [0,12,10,3,6,"","E"];
talents["Naturalist"] = [0,0,10,2,4,"","RU"];
talents["Net and Trident"] = [10,0,8,1,2,"Pole Weapons","W"];
talents["Nunchuks"] = [9,0,8,1,2,"","W"];
talents["Physicker"] = [0,0,11,2,4,"","S"];
talents["Pickpocket"] = [0,0,9,1,2,"","S"];
talents["Poet"] = [0,0,10,1,2,"Literacy","NS"];
talents["Pole Weapons"] = [9,8,7,2,4,"","W"];
talents["Pole Weapons Expertise"] = [0,12,11,3,6,"Pole Weapons","C"];
talents["Pole Weapons Mastery"] = [0,14,13,3,6,"Pole Weapons Expertise","C"];
talents["Potter"] = [0,0,8,2,4,"","S"];
talents["Priest"] = [0,0,9,1,2,"","S"];
talents["Quarterstaff"] = [11,0,8,1,2,"","W"];
talents["Quick-Draw"] = [0,12,8,1,2,"","C"];
talents["Recognize Value"] = [0,0,9,1,2,"","NA"];
talents["Remove Traps"] = [0,0,10,1,2,"Detect Traps","A"];
talents["Running"] = [0,0,8,2,4,"","A"];
talents["Scholar"] = [0,0,13,3,6,"Literacy","NS"];
talents["Scribe"] = [0,0,8,1,2,"Literacy","S"];
talents["Sculptor"] = [0,0,8,2,4,"","S"];
talents["Seamanship"] = [0,0,8,1,2,"","T"];
talents["Sex Appeal"] = [0,0,8,1,2,"","E"];
talents["Sha-ken"] = [0,0,8,1,2,"Thrown Weapons","W"];
talents["Shield Expertise"] = [0,0,10,2,4,"Shield","C"];
talents["Shield"] = [0,0,7,1,2,"","C"];
talents["Shipbuilder"] = [0,0,11,2,4,"Seamanship","S"];
talents["Silent Movement"] = [0,0,9,2,4,"","A"];
talents["Spear Thrower"] = [9,0,8,1,2,"Pole Weapons","MW"];
talents["Stealth"] = [0,0,12,2,4,"Silent Movement","A"];
talents["Strategist"] = [0,0,13,2,4,"Tactics","A"];
talents["Streetwise"] = [0,0,9,1,2,"-Thieves’ argot","A"];
talents["Swimming"] = [0,0,8,1,2,"","A"];
talents["Sword"] = [0,8,7,1,2,"Knife","W"];
talents["Sword Expertise"] = [11,12,11,3,6,"Sword","C"];
talents["Sword Mastery"] = [11,14,13,3,6,"Sword Expertise","C"];
talents["Tactics"] = [0,0,11,1,2,"","A"];
talents["Tailor"] = [0,0,8,1,2,"","S"];
talents["Tanner"] = [0,0,8,1,2,"","S"];
talents["Theologian"] = [0,0,14,2,4,"Priest","S"];
talents["Thrown Weapons"] = [0,0,8,2,4,"","C"];
talents["Toughness"] = [12,0,9,2,4,"","C"];
talents["Toughness II"] = [14,0,9,2,4,"Toughness","C"];
talents["Tracking"] = [0,0,10,1,2,"","ARU"];
talents["Two Weapons"] = [0,11,11,2,4,"","C"];
talents["Unarmed Combat I"] = [0,0,10,1,2,"","C"];
talents["Unarmed Combat II"] = [0,11,11,1,2,"Unarmed Combat I","C"];
talents["Unarmed Combat III"] = [0,12,12,2,4,"Unarmed Combat II","C"];
talents["Unarmed Combat IV"] = [11,13,13,3,6,"Unarmed Combat III","C"];
talents["Unarmed Combat V"] = [12,14,14,4,8,"Unarmed Combat IV","C"];
talents["Ventriloquist"] = [0,0,12,1,2,"","E"];
talents["Vet"] = [0,0,9,2,4,"Animal Handler","FRTU"];
talents["Vintner"] = [0,0,8,2,4,"","S"];
talents["Weapon Expertise"] = [0,12,11,3,6,"","C"];
talents["Weapon Mastery"] = [0,14,13,3,6,"Weapon Expertise","C"];
talents["Weaver"] = [0,0,8,2,4,"","S"];
talents["Whip"] = [8,0,8,1,2,"","W"];
talents["Woodcarver"] = [0,0,8,1,2,"","S"];
talents["Woodsman"] = [0,0,11,1,2,"Naturalist","RU"];
talents["Writing"] = [0,0,11,1,2,"Literacy","NS"];

var languages = {};
languages["Common"] = [0,0,7,1,1,"","L"];
languages["Centaur"] = [0,0,7,1,1,"","L"];
languages["Dragon"] = [0,0,14,1,1,"","L"];
languages["Dwarvish"] = [0,0,7,1,1,"","L"];
languages["Elvish"] = [0,0,7,1,1,"","L"];
languages["Fog Runes"] = [0,0,7,1,1,"","L"];
languages["Gargoyle"] = [0,0,7,1,1,"","L"];
languages["Giant"] = [0,0,7,1,1,"","L"];
languages["Goblin"] = [0,0,7,1,1,"","L"];
languages["High Elvish"] = [0,0,7,1,1,"","L"];
languages["Merfolk"] = [0,0,7,1,1,"","L"];
languages["Old Dwarvish"] = [0,0,10,1,1,"Dwarvish","L"];
languages["Orcish"] = [0,0,7,1,1,"","L"];
languages["Reptile Person"] = [0,0,7,1,1,"","L"];
languages["Sasquatch"] = [0,0,9,1,1,"","L"];
languages["Sea Elvish"] = [0,0,7,1,1,"","L"];
languages["Shadowight"] = [0,0,7,1,1,"","L"];
languages["Sorcerers’ Tongue"] = [0,0,7,1,1,"","L"];
languages["Thieves’ argot"] = [0,0,7,1,1,"","L"];
languages["Troglodyte"] = [0,0,7,1,1,"","L"];
languages["Troll"] = [0,0,7,1,1,"","L"];
languages["Yeti"] = [0,0,7,1,1,"","L"];

class Talent {
  constructor(str) {
    this.error = "";
    let ary = str.split("(");
    this.name = ary[0].trim();
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    if(this.name in talents) {
      this.row = talents[this.name];
    } else {
      throw new Error("Unable to find talent for {" + str +"}");
      console.log(this.error);
    }
    this.qualifier = "";
    if(0 < ary.lengt) this.qualifier = ary[1].slice(0,-1);
    if("" !== this.qualifier) {
      switch(this.name) {
      case "Weapon Expertise":
        this.testname(this.qualifier + " Expertise"); 
        break;
        
      case "Weapon Mastery":
        this.testname(this.qualifier + " Mastery");
        break;
      }
      
      if("" !== this.qualifier) switch(this.qualifier) {
        case "Expert":
        this.testname(this.name + " Expertise");
        break;
        
        case "Master":
        this.testname(this.name + " Mastery");
        break;
        
        case "x2":
        this.testname(this.name + " II");
        break;
        
        case "x3":
        this.testname(this.name + " III");
        break;
      }
    }
  }
  // Adopt a new talent name, if it fits, else nothing.
  testname(str) {
    if(str in talents) {
      this.name = str;
      this.row = talents[this.name];
      this.qualifier = "";      
    }
  }
  
  preq() {
    let req = this.row[5];
    if("-" === req.substring(0,1)) req = req.substring(1);
    return req;
  }

  cat() {
    return this.row[6];
  }

  toString() {
    let result = this.name;
    if("" !== this.qualifier) result += " (" +this.qualifier +")";
    return result;
  }

  // Raises being to minumum needed
  satisfy(being) {
    if(being.ST < this.row[0]) {
      being.errors.push(this.name + " requires ST " +this.row[0]);
      if(this.row[0] > being.race.row[1]) return false;
      being.ST = this.row[0];
    }
    if(being.DX < this.row[1]) {
      being.errors.push(this.name + " requires DX " +this.row[1]);
      if(this.row[1] > being.race.row[3]) return false;
      being.DX = this.row[1];
    }
    if(being.IQ < this.row[2]) {
      being.errors.push(this.name + " requires IQ " +this.row[2]);
      if(this.row[2] > being.race.row[5]) return false;
      being.IQ = this.row[2];
    }
    let pre = this.row[5];
    if("" == pre) return true;
    if("-" == pre.substr(0,1)) {
      pre = pre.substr(1);
      if(pre in languages) {
        being.bonl[pre] = 1;
        being.lang[pre] = new Language(pre);
        return true;
      } else {
        being.bont[pre] = 1;
      }
    }
    if(!(pre in being.talents)) {
      let preq = new Talent(pre);
      if(preq.satisfy(being)) being.talents[pre] = preq;
    }
    return true;
  }
};

class Language {
  constructor(str) {
    this.error = "";
    this.name = str;
    if(this.name in languages) {
      this.row = languages[this.name];
    } else {
      console.log("Unable to find language for {" + str +"}");
    }
  }
  
  preq() {
    let req = this.row[5];
    if("-" === req.substring(0,1)) req = req.substring(1);
    return req;
  }

  cat() {
    return this.row[6];
  }

  toString() {
    let result = this.name;
    return result;
  }
};

var spell_type = {};
spell_type["C"] = "Combat";
spell_type["E"] = "Entertainment";
spell_type["G"] = "General";
spell_type["M"] = "Merchant";
spell_type["N"] = "Nobel";
spell_type["T"] = "Thief";
spell_type["U"] = "Nature";

var spells = {};
// Name, 0:Min_IQ 1:Cast type 2:Cost 3:Category 4:Req 5:Min_ST
spells["Acid Touch"] = [11,"T","1/1","C","",4];
spells["Adhesion"] = [10,"S","1","E","",3];
spells["Aid"] = [9,"T","1+","G","",3];
spells["Analyze Magic"] = [12,"T","4","MG","",6];
spells["Astral Projection"] = [15,"S","10","CGM","",12];
spells["Avert"] = [9,"T","2/1","C","",5];
spells["Bind Spirit"] = [13,"T","1+","CN","",6];
spells["Blast Trap"] = [17,"S","6+","CG","",7];
spells["Blast"] = [12,"S","2","C","",4];
spells["Blur"] = [8,"T","1/1","CE","",4];
spells["Break Weapon"] = [12,"T","3","C","",5];
spells["Breathe Fire"] = [12,"T","1+","CE","",3];
spells["Calling"] = [15,"S","5","GMU","",7];
spells["Cleanse Poison"] = [12,"T","4","NG","",6];
spells["Cleansing"] = [17,"T","20/hex","GM","",21];
spells["Clearheadedness"] = [10,"T","1","NG","",3];
spells["Close Vision"] = [10,"T","1/30min","MG","",3];
spells["Clumsiness"] = [9,"T","1+","C","",3];
spells["Confusion"] = [9,"T","1+","C","",3];
spells["Control Animal"] = [11,"T","2/1","CU","",5];
spells["Control Elemental"] = [13,"T","3/1min","C","",6];
spells["Control Gate"] = [18,"C","10/50","GM","",1];
spells["Control Person"] = [13,"T","3/1","NC","",6];
spells["Create Gate"] = [15,"C","50","GMT","",10];
spells["Create Wall"] = [11,"C","2","C","",4];
spells["Create/Destroy Elemental"] = [16,"S","5+","CG","",7];
spells["Curse"] = [13,"T","2x","NC","",4];
spells["Dark Vision"] = [9,"T","3/hr","CTU","",5];
spells["Darkness"] = [9,"S","1+/1","CT","",4];
spells["Dazzle"] = [10,"S","3","C","",5];
spells["Death Spell"] = [16,"T","1+","NC","",3];
spells["Delete Writing"] = [11,"T","1+","MNG","",3];
spells["Destroy Creation"] = [11,"T","1","C","",3];
spells["Detect Enemies"] = [10,"S","3+2","NC","",7];
spells["Detect Life"] = [9,"S","2+","CTU","",4];
spells["Detect Magic"] = [8,"T","1","MNG","",3];
spells["Diamond Flesh"] = [17,"T","4/1","C","",6];
spells["Dispel Illusions"] = [14,"S","5","C","",7];
spells["Dispel Missiles"] = [10,"T","1/1","C","",4];
spells["Dissolve Enchantment"] = [17,"T","50","G","",51];
spells["Drain Strength"] = [12,"S","S","CG","",3];
spells["Drop Weapon"] = [8,"T","1-2","C","",3];
spells["Duplicate Writing"] = [14,"T","2","MNG","",4];
spells["Explosive Gem"] = [14,"S","5x","NC","",7];
spells["Expunge"] = [17,"S","125/day","G","",8];
spells["Eyes-Behind"] = [12,"T","3/1","NC","",6];
spells["Far Vision"] = [10,"T","1/5min","CU","",3];
spells["Ferment"] = [11,"T","2+","G","",4];
spells["Fire"] = [9,"C","1","CEU","",3];
spells["Fireball"] = [12,"M","1-3","NC","",3];
spells["Fireproofing"] = [13,"T","3/1","C","",6];
spells["Flight"] = [13,"T","3/1","CE","",6];
spells["Freeze"] = [12,"T","4","NC","",6];
spells["Fresh Air"] = [14,"S","2/1min","C","",5];
spells["Friendship"] = [12,"S","2-4","MGU","",4];
spells["Geas"] = [17,"S","10","CGN","",11];
spells["Giant Rope"] = [15,"C","4","NCU","-Rope",6];
spells["Glamor"] = [14,"T","10","NET","",12];
spells["Great Voice"] = [11,"T","1/min","NE","",3];
spells["Greater Magic Item Creation"] = [20,"S","*","G","",8];
spells["Hammertouch"] = [15,"T","1+","C","",3];
spells["3-Hex Fire"] = [12,"C","2","C","-Fire",4];
spells["3-Hex Shadow"] = [12,"C","2","C","-Shadow",4];
spells["3-Hex Wall"] = [13,"C","4","C","-Create Wall",6];
spells["4-Hex Illusion"] = [14,"C","3","CE","-Illusion",5];
spells["4-Hex Image"] = [13,"C","2","CE","-Image",4];
spells["7-Hex Fire"] = [16,"C","4","C","-3-Hex Fire",6];
spells["7-Hex Illusion"] = [16,"C","5","C","-4-Hex Illusion",7];
spells["7-Hex Image"] = [15,"C","4","C","-4-Hex Image",6];
spells["7-Hex Shadow"] = [15,"C","3","C","-3-Hex Shadow",5];
spells["7-Hex Wall"] = [16,"C","6","C","-3-Hex Wall",8];
spells["Illusion"] = [11,"C","2","C","",4];
spells["Image"] = [8,"C","1","CE","",3];
spells["Insubstantiality"] = [17,"T","4/2","CN","",7];
spells["Invisibility"] = [12,"T","3/1","CTU","",6];
spells["Iron Flesh"] = [15,"T","3/1","C","",6];
spells["Lesser Magic Item Creation"] = [18,"S","*","G","",6];
spells["Light"] = [8,"T","1","G","",3];
spells["Lightning"] = [14,"M","1-3","NC","",3];
spells["Lock/Knock"] = [10,"T","2","T","",4];
spells["Long-Distance Telepathy"] = [16,"S","12","MNCG","",14];
spells["Long-Distance Teleport"] = [19,"S","20","CT","",21];
spells["Look Your Best"] = [9,"T","1","MNE","",3];
spells["Mage Sight"] = [12,"T","2/1min","C","",4];
spells["Magic Fist"] = [8,"M","1-3","NC","",3];
spells["Magic Rainstorm"] = [12,"C","4","C","",6];
spells["Meal"] = [10,"C","2x","GU","",4];
spells["Megahex Avert"] = [15,"T","3/1","CMN","",6];
spells["Megahex Freeze"] = [18,"T","12","CN","",13];
spells["Megahex Sleep"] = [16,"T","8","C","",10];
spells["Minor Medicament"] = [10,"T","2","G","",4];
spells["Open Tunnel"] = [13,"T","10","C","",12];
spells["Pathfinder"] = [12,"S","3","CM","",5];
spells["Pentagram"] = [15,"C","5/1","G","",8];
spells["Persuasiveness"] = [11,"T","2/min","MNE","",4];
spells["Possession"] = [20,"S","20","CNT","",21];
spells["Regeneration"] = [15,"T","30","G","",10];
spells["Remove Cursed Object"] = [17,"T","20","GMNT","",21];
spells["Remove Thrown Spell"] = [14,"T","2","NCG","",4];
spells["Repair"] = [12,"T","6","G","",8];
spells["Restore Device"] = [14,"T","12+","G","",14];
spells["Reveal Magic"] = [9,"S","1/1","MC","",4];
spells["Reveal/Conceal"] = [11,"T","2+","MNT","",4];
spells["Reverse Missiles"] = [11,"T","2/1","C","",5];
spells["Revival"] = [19,"T","50","C","",51];
spells["Rope"] = [11,"C","2","CU","",4];
spells["Scour"] = [11,"T","1","MG","",3];
spells["Scrying"] = [13,"S","1+","MNCGETU","",3];
spells["Shadow"] = [10,"C","1","C","",3];
spells["Shapeshifting"] = [18,"T","10/20","CGN","",11];
spells["Shock Shield"] = [10,"T","2/1","C","",5];
spells["Silent Movement"] = [11,"T","1/1","TU","",4];
spells["Sleep"] = [11,"T","3","CT","",5];
spells["Slippery Floor"] = [13,"T","3","CT","",5];
spells["Slow Movement"] = [8,"T","2","C","",4];
spells["Soothe"] = [12,"T","1","MNGU","",3];
spells["Speed Movement"] = [10,"T","2","C","",4];
spells["Spell Shield"] = [14,"T","3/1","NC","",6];
spells["Spellsniffer"] = [17,"T","2/1","CGMNT","",4];
spells["Staff II"] = [11,"S","5","CG","Staff",7];
spells["Staff III"] = [13,"S","5","CG","Staff II","",7];
spells["Staff IV"] = [15,"S","5","CG","Staff III",7];
spells["Staff V"] = [17,"S","5","CG","Staff IV",6];
spells["Staff to Snake"] = [10,"T","1","CE","Staff",3];
spells["Staff"] = [8,"S","5","NCGU","",7];
spells["Stalwart"] = [10,"T","3/day","CU","",5];
spells["Sticky Floor"] = [13,"T","3","CT","",5];
spells["Stone Flesh"] = [13,"T","2/1","C","",5];
spells["Stop"] = [13,"T","3","NCU","",5];
spells["Summon Bear"] = [11,"C","4/1","C","",7];
spells["Summon Demon"] = [17,"C","30","CGT","",31];
spells["Summon Dragon"] = [16,"C","5/2","C","",9];
spells["Summon Gargoyle"] = [13,"C","4/1","C","",7];
spells["Summon Giant"] = [14,"C","4/1","C","",7];
spells["Summon Lesser Demon"] = [14,"C","20","G","",22];
spells["Summon Myrmidon"] = [10,"C","2/1","C","",5];
spells["Summon Scout"] = [9,"C","1/1min","NCTU","",4];
spells["Summon Small Dragon"] = [15,"C","5/1","C","",8];
spells["Summon Wolf"] = [9,"C","2/1","CU","",5];
spells["Telekinesis"] = [13,"T","2/2","NCET","",6];
spells["Telepathy"] = [14,"T","4/1","MNCEU","",7];
spells["Teleport"] = [15,"S","1+","CEMT","",3];
spells["The Little Death"] = [17,"T","1+","CGN","",2];
spells["Trailtwister"] = [10,"S","4","T","",6];
spells["Trance"] = [16,"S","10","NG","",12];
spells["Trip"] = [10,"T","2+2","C","",4];
spells["Turn Missiles"] = [9,"T","1/1","C","",4];
spells["Unnoticeability"] = [15,"T","3/1","MNCETU","",6];
spells["Ward"] = [10,"S","2/day","NCU","",4];
spells["Weapon/Armor Enchantment"] = [14,"T","*","G","",3];
spells["Whisper"] = [10,"T","2/min","NE","",4];
spells["Wizard’s Wrath"] = [18,"M","1-3","C","",4];
spells["Word of Command"] = [20,"S","3","CNT","",4];
spells["Write Scroll"] = [16,"S","*","G","",3];
spells["Zombie"] = [19,"T","7+","CG","",8];

var staff_spells = ["Staff", "Staff II", "Staff III", "Staff IV", "Staff V"];

var enchantments = {};
// 0: Base cost
// 1: level up formula +H = Hex, +#MH = +x megahex
// 2: Subjects: * - Itself, A - Armor, B - Bow, M - Missile, R - Ring or such, W - Weapon
enchantments["Magic Fist"] = [2000,"","W"];
enchantments["Blur"] = [3000,"BH",""];
enchantments["Slow Movement"] = [500,"BH","M"];
enchantments["Drop Weapon"] = [500,"","M"];
enchantments["Detect Magic"] = [5000,"",""];
enchantments["Light"] = [500,"",""];
enchantments["Clumsiness Cuffs"] = [1000,"AM","*"];
enchantments["Confusion Cuffs"] = [1000,"AM","*"];
enchantments["Weakness Cuffs"] = [1000,"AM","*"];
enchantments["Avert"] = [2000,"","R"];
enchantments["Detect Life"] = [4000,"","R"];
enchantments["Darkness"] = [2000,"AH","R"];
enchantments["Dark Vision"] = [3000,"","R"];
enchantments["Detect Enemies"] = [6000,"","R"];
enchantments["Lock seal"] = [500,"","*"];
enchantments["Knock key"] = [1000,"","*"];
enchantments["Trip"] = [1000,"BH","M"];
enchantments["Boots of Speed Movement"] = [1500,"BH","*"];
enchantments["Dazzle Gem"] = [250,"","*"];
enchantments["Shock Shield"] = [5000,"BH","R"];
enchantments["Shadow"] = [1000,"BH",""];
enchantments["Far Vision"] = [2500,"",""];
enchantments["Sleep"] = [1000,"BH","M"];
enchantments["Reverse Missiles"] = [5000,"BH","R"];
enchantments["Magic Rope"] = [1000,"","*"];
enchantments["Destroy Illusion"] = [2000,"",""];
enchantments["Boots of Silent Movement"] = [2000,"BH","*"];
enchantments["Persuasiveness"] = [12000,"","R"];
enchantments["Freeze"] = [5000,"","M"];
enchantments["Fireball"] = [5500,"","W"];
enchantments["Invisibility"] = [6500,"BH","R"];
enchantments["Mage Sight"] = [6000,"","R"];
enchantments["Magic Rainstorm vial"] = [4500,"","*"];
enchantments["Eyes-Behind"] = [3000,"","R"];
enchantments["Flight"] = [10000,"BH","R"];
enchantments["Stone Flesh"] = [4000,"BH","R"];
//enchantments["Slippery Floor (fixed)"] = [2000,"C","L"];
enchantments["Slippery Floor"] = [4000,"C","M"];
//enchantments["Sticky Floor (fixed)"] = [2000,"C","L"];
enchantments["Sticky Floor"] = [4000,"C","M"];
enchantments["Curse"] = [3500,"AM","M"];
enchantments["Fireproofing"] = [5000,"BH","A"];
enchantments["Telekinesis"] = [5000,"","R"];
enchantments["Lightning"] = [15000,"D","W"];
enchantments["Dispel Illusions"] = [5000,"",""];
enchantments["Spell Shield"] = [6000,"BH","R"];
enchantments["Telepathy"] = [20000,"","R"];
enchantments["Glamour"] = [4000,"",""];
enchantments["Helm of Fresh Air"] = [3000,"BH","*"];
enchantments["Summon Wolf Gem"] = [500,"C","*"];
enchantments["Summon Myrmidon Gem"] = [500,"C","*"];
enchantments["Summon Bear Gem"] = [1000,"C","*"];
enchantments["Summon Gargoyle Gem"] = [1000,"C","*"];
enchantments["Summon Giant Gem"] = [2000,"C","*"];
enchantments["Summon Small Dragon Gem"] = [2000,"C","*"];
enchantments["Summon 7-Hex Dragon Gem"] = [4000,"C","*"];
enchantments["Quiver of Replenishment"] = [1000,"","*"];
enchantments["silver arrow Quiver of Replenishment"] = [5000,"","*"];
enchantments["+1 DX silver arrow Quiver of Replenishment"] = [15000,"","*"];
enchantments["Amulet vs. Drunkenness"] = [1500,"","*"];
enchantments["Amulet vs. Drowning"] = [2000,"","*"];
enchantments["Amulet vs. Creature"] = [3000,"","*"];
enchantments["Amulet vs. all elementals"] = [5000,"","*"];
enchantments["Amulet vs. Disease"] = [10000,"","*"];
//enchantments["Pentagram"] = [2000,"BH","L"];
enchantments["Maintain Illusion"] = [3000,"B5MH",""];
enchantments["Maintain Image"] = [1400,"BH",""];
enchantments["Ring of Control"] = [10000,"E","*"];
enchantments["2-hex Magic Carpet"] = [10000,"","*"];
enchantments["4-hex Magic Carpet"] = [20000,"","*"];
enchantments["7-hex Magic Carpet"] = [50000,"","*"];
enchantments["Serpent Torc"] = [2000,"","*"];
enchantments["Limiting Spell"] = [1000,"I",""];
enchantments["Expunge"] = [2000,"I",""];
enchantments["Iron Flesh"] = [16000,"D","R"];
enchantments["Teleport"] = [15000,"D","R"];
enchantments["Giant Rope"] = [2000,"","*"];
enchantments["Cloak of Astral Projection"] = [20000,"","*"];
enchantments["Hammertouch glove"] = [5000,"","*"];
enchantments["Unnoticeability"] = [5000,"","R"];
enchantments["Long-Distance Telepathy"] = [20000,"","R"];
enchantments["Insubstantiability"] = [21000,"","R"];
enchantments["Amulet of Cleansing"] = [50000,"D","*"];
enchantments["Spellsniffer"] = [20000,"D","R"];
enchantments["Little Death"] = [10000,"",""];
enchantments["Geas"] = [5000,"",""];
enchantments["Shapeshifting"] = [10000,"",""];
enchantments["Wizard’s Wrath"] = [40000,"F","W"];
enchantments["Long-Distance Teleport"] = [50000,"F",""];
enchantments["Word of Command"] = [20000,"",""];
enchantments["Crystal Ball"] = [50000,"G","*"];
enchantments["Flaming Weapon"] = [10000,"C","W"];
enchantments["Flaming missile weapon"] = [20000,"C","B"];
enchantments["5 Wards"] = [30000,"","*"];
enchantments["Powerstone"] = [1000,"BS","*"];
enchantments["+1 Charm"] = [30000,"D","*"];
enchantments["+2 Charm"] = [100000,"F","*"];
enchantments["Increase ST"] = [2000,"AP","R"];
enchantments["Increase DX"] = [2000,"AP","R"];
enchantments["Increase IQ"] = [2000,"AP","R"];
enchantments["Magic Fist rod"] = [1000,"BD","*"];
enchantments["Fireball rod"] = [2000,"BD","*"];
enchantments["Lightning-bolt rod"] = [5000,"BD","*"];
enchantments["Wizards’s Wrath rod"] = [10000,"BD","*"];
enchantments["Unicorn Drinking Horn"] = [6500,"",""];
enchantments["Gate-Key"] = [10000,"","*"];
enchantments["Gate-Lock"] = [5000,"","*"];
enchantments["Gate-Seal"] = [10000,"","*"];
enchantments["Bound Small Demon gem"] = [20000,"E","*"];
enchantments["Amulet of Skepticism"] = [4000,"","*"];
enchantments["Hand of Glory"] = [4000,"","*"];
enchantments["Lens of Translation"] = [6000,"BL","*"];
enchantments["Zombie Ring"] = [3000,"","*"];

class Spell {
  constructor(str) {
    this.error = "";
    this.name = str.trim();
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    if(this.name in sub_spells) this.name = sub_spells[this.name];
    if(this.name in spells) {
      this.row = spells[this.name];
    } else {
      console.log("Unable to find spell for {" + str +"}");
    }
  }

  preq() {
    let req = this.row[4];
    if("-" === req.substring(0,1)) req = req.substring(1);
    return req;
  }

  // Raises being to minumum needed
  satisfy(being) {
    if(being.IQ < this.row[0]) {
      being.errors.push(this.name + " requires IQ " +this.row[0]);
      if(this.row[0] > being.race.row[5]) return false;
      being.IQ = this.row[0];
    }
    let pre = this.preq();
    if("" == pre) return true;
    if(!(pre in being.spells)) {
      let preq = new Spell(pre);
      being.spells[pre] = preq;
      preq.satisfy(being);
    }
    return true;
  }

};

class Enchantment {
  constructor(name,budget) {
    this.name = name;
    this.row = enchantments[name];
    this.value = this.row[0];
    this.level = 1;
    let rule = this.row[1];
    if("" === rule) return;
    let note = rule.substring(0,1);
    switch (note) {
    case "A":
      while((budget > 2*this.value) && (5 > this.level)) {
        this.level++;
        this.value *= 2;
      }
      break;
    case "B":
      this.level = Math.floor(budget / this.value);
      if(20 < this.level) this.level = 20;
      this.value *= this.level;
      break;
    default:
      return;
    }
    let mod = rule.substring(1);
    switch (mod) {
    case "D":
      this.name = "" + this.level +"-dice " +name;
      break;
    case "H":
      if(this.level > 1)
        this.name = "" + this.level +"-hex " +name;
      break;
    case "L":
      if(1 == this.level) {
        this.level++;
        this.value *= 2;
      }
      this.name = "" + this.level +"-language " +name;
      break;
    case "M":
      this.name = "-" + this.level +" " +name;
      break;
    case "5MH":
      if(this.level > 1)
        this.name = "" + (5* this.level) +"-megahex " +name;
      break;
    case "P":
      this.name = "+" + this.level +" " +name;
      break;
    case "S":
      this.value += 1000;
      this.name = "" + this.level +" point " +name;
      break;
    }
  }
  
  material() {
    return this.row[2];
  }
}

function random_enchantment(budget) {
  let keys = Object.keys(enchantments);
  for(let i =0; i < 5; i++) {
    let name = keys[ keys.length * Math.random() << 0];
    let row = enchantments[name];
    if(row[0] > budget) continue;
    return new Enchantment(name,budget);
  }
  return "";
}

// Code, name
var materials = {};
materials["*"] = "Gem or Glass";
materials["B"] = "Food";
materials["C"] = "Copper";
materials["F"] = "Fabric";
materials["G"] = "Gold";
materials["I"] = "Iron";
materials["K"] = "Silk";
materials["L"] = "Leather";
materials["P"] = "Paper";
materials["R"] = "Rope";
materials["S"] = "Silver";
materials["W"] = "Wood";

// Name, 0:talent 1:txt_dam 2:Hands 3:min_st 4:avg_dam 5:cost 6:wt 7:material
var weapons = {};
weapons["torch"] = ["","1d-2","1",0,1.7,1,0.5,"W"];
weapons["brand"] = ["","1d-2","1",0,1.7,60,0.5,"W"];
weapons["club"] = ["Staff","1d-1","1",0,2.5,10,3.0,"W"];
weapons["crowbar"] = ["","1d+2","2",12,5.5,10,4.0,"I"];
weapons["maul"] = ["Staff","1d","1",0,3.5,20,5.0,"W"];
weapons["wand"] = ["Staff","","1",0,0,0,0.0,"W"];
weapons["cane"] = ["","1d-2","1",0,1.7,20,3.0,"W"];

weapons["dagger"] = ["Knife","1d-1","T",0,2.5,10,0.2,"I"];
weapons["rapier"] = ["Sword","1d","1",9,3.5,40,1,"I"];
weapons["saber"] = ["Sword","2d-2","1",10,5.0,50,3,"I"];
weapons["shortsword"] = ["Sword","2d-1","1",11,6.0,60,4,"I"];
weapons["broadsword"] = ["Sword","2d","1",12,7.0,80,5,"I"];
weapons["bastard sword"] = ["Sword","2d+1/3d-2","1",13,8.0,100,7,"I"];
weapons["2-handed sword"] = ["Sword","3d-1","2",14,9.5,120,10,"I"];
weapons["great sword"] = ["Sword","3d+1","2",16,11.5,150,15,"I"];

weapons["hatchet"] = ["Axe/Mace","1d","T",9,3.5,15,2,"I"];
weapons["hammer"] = ["Axe/Mace","1d+1","T",10,4.5,25,4,"I"];
weapons["mace"] = ["Axe/Mace","2d-1","T",11,6.0,40,6,"I"];
weapons["small ax"] = ["Axe/Mace","1d+2","T",11,5.5,30,5,"I"];
weapons["war ax"] = ["Axe/Mace","2d","1",12,7.0,60,8,"I"];
weapons["pick"] = ["Axe/Mace","2d","2",13,7.0,50,8,"I"];
weapons["morningstar"] = ["Axe/Mace","2d+1","1",13,8.0,100,12,"I"];
weapons["great hammer"] = ["Axe/Mace","2d+2","2",14,9.0,110,16,"I"];
weapons["battle axe"] = ["Axe/Mace","3d","2",15,10.5,130,22,"I"];

weapons["javelin"] = ["Pole Weapons","1d-1","T",9,3.0,20,3,"I"];
weapons["trident"] = ["Net and Trident","1d","T",10,3.5,30,4,"I"];
weapons["spear"] = ["Pole Weapons","1d/1d+1","T",11,4.0,40,6,"I"];
weapons["halberd"] = ["Pole Weapons","2d","2",13,7.5,70,16,"I"];
weapons["pike ax"] = ["Pole Weapons","2d+2","2",15,9.5,100,22,"I"];

weapons["quarterstaff"] = ["Quarterstaff","1d+2","2",11,5.5,20,5,"W"];

weapons["sling"] = ["Bow","1d-2","M",0,1.0,2,1,"R"];
weapons["small bow"] = ["Bow","1d-1","M",9,2.5,20,4,"W"];
weapons["horse bow"] = ["Bow","1d","M",10,3.5,30,4,"W"];
weapons["longbow"] = ["Bow","1d+2","M",11,5.5,40,4,"W"];
weapons["light crossbow"] = ["Crossbow","2d","M",12,7.0,50,6,"I"];
weapons["heavy crossbow"] = ["Crossbow","3d","M",15,10.5,80,10,"I"];
weapons["net"] = ["Net and Trident","1d-3","T",10,3.5,40,2,"I"];
weapons["whip"] = ["Whip","1d-1","T",8,2.5,30,1,"L"];
weapons["lasso"] = ["Lasso","1d+2","T",8,5.5,10,1,"R"];
weapons["boomerang"] = ["Boomerang","2d-1","T",11,6.0,20,3,"W"];
weapons["nunchuks"] = ["Nunchuks","1d+1","1",9,4.5,35,4,"I"];
weapons["spear thrower-javelin"] = ["Spear Thrower","1d+1","T",9,4.5,35,5,"W"];
weapons["spear thrower-spear"] = ["Spear Thrower","1d+2","T",11,5.5,55,8,"W"];
weapons["blowgun"] = ["Blowgun","pos","M",0,2.5,15,1,"I"];
weapons["bola"] = ["Bola","spe","T",9,5.5,15,1,"R"];
weapons["sha-ken"] = ["Sha-ken","1d-2","T",0,1.7,3,1,"I"];
weapons["arquebus"] = ["Guns","3d+3","M",8,7.0,500,12,"I"];

// Name 0:stops 1:DX 2:cost 3:weight 4:human ma 5:elf ma 6:material
var armors ={};
armors["lower-class clothes"] = [0,0,10,0,10,12,"F"];
armors["apprentice robes"] = [0,0,50,0,10,12,"F"];
armors["middle-class clothes"] = [0,0,50,0,10,12,"F"];
armors["upper-class clothes"] = [0,0,200,0,10,12,"F"];
armors["silken robes"] = [0,0,200,0,10,12,"K"];
armors["cloth armor"] = [1,-1,50,14,10,12,"F"];
armors["leather armor"] = [2,-2,100,16,8,10,"L"];
armors["chainmail"] = [3,-3,200,30,6,6,"I"];
armors["half plate"] = [4,-4,300,45,6,6,"I"];
armors["plate armor"] = [5,-5,500,55,6,6,"I"];
armors["water armor"] = [3,-1,1000,14,10,12,"F"];
armors["fine plate"] = [6,-4,5000,55,6,6,"I"];

// Name 0:stops 1:DX 2:cost 3:weight 4:notes 5:material
var shields = {};
shields["small shield"] = [1,0,30,10.0,"","W"];
shields["spike shield"] = [1,0,40,12.0,"1d-2 for shield rush","I"];
shields["large shield"] = [2,-1,50,20.0,"","W"];
shields["tower shield"] = [3,-2,70,35.0,"","W"];

// Name 0:Cost 1:wt 2:cat 3:material
var items = {};
items["arrow"] = [1,0.05,"M","I"];
items["backpack"] = [40,4.0,"P","L"];
items["belt pouch"] = [5,0.5,"P","L"];
items["book"]  = [5,1.0,"M","P"];
items["coin"] = [0.1,0.01,"M","I"];
items["gem"]  = [50,0.01,"R","*"];
items["jewel"]  = [1000,0.01,"R","*"];
items["labyrinth kit"] = [30,6,"U","F"];
items["medium bag"] = [20,2.0,"P","F"];
items["small bag"] = [1,0.25,"P","F"];
items["molotail"] = [20,2.0,"M","*"];
items["physicker’s kit"] = [50,4.0,"T","W"];
items["pointer necklace"]  = [150,0.1,"U","S"];
items["collapsible 6-foot pole"] = [5,2.0,"M","W"];
items["quarrel"] = [1,0.05,"M","I"];
items["ration"] = [5,1.0,"M","B"];
items["yard rope"] = [.2,0.12,"U","R"];
items["10-yard rope ladder"] = [50,4.0,"U","R"];
items["silver ring"] = [50,0.01,"R","S"];
items["empty skin"]  = [3,0.2,"M","L"];
items["small backpack"] = [30,3.0,"P","L"];
items["small silver mirror"]  = [200,1.0,"M","S"];
items["waterskin"]  = [3,2.0,"M","L"];
items["wineskin"]  = [5,2.0,"M","L"];
items["wizard’s chest"] = [2500,10.0,"W","W"];

// Name 0: C or A, 1: isBomb?, 2: cost
var potions = {};
potions["berserker potion"] = ["C",false,200];
potions["corrosive poison"] = ["C",true,500];
potions["decrease dx potion"] = ["C",true,80];
potions["decrease iq potion"] = ["C",true,200];
potions["decrease st potion"] = ["C",true,100];
potions["fish poison"] = ["C",false,250];
potions["gunpowder charge"] = ["C",false,100];
potions["increase dx potion"] = ["C",false,600];
potions["increase iq potion"] = ["C",false,600];
potions["increase st potion"] = ["C",false,450];
potions["insect poison"] = ["C",true,150];
potions["mammal poison"] = ["C",true,250];
potions["plant poison"] = ["C",true,200];
potions["reptile poison"] = ["C",true,100];
potions["simple poison"] = ["C",true,120];
potions["sleeping potion"] = ["C",true,150];
potions["slime poison"] = ["C",true,50];
potions["smell booster potion"] = ["C",false,200];
potions["weapon poison"] = ["C",false,200];
potions["acute hearing potion"] = ["A",false,250];
potions["contact poison"] = ["A",false,2500];
potions["dark vision potion"] = ["A",false,500];
potions["fear potion"] = ["A",true,150];
potions["fireproofing potion"] = ["A",false,250];
potions["flight potion"] = ["A",false,1200];
potions["healing potion"] = ["A",false,150];
potions["imprisonment potion"] = ["A",false,1000];
potions["invisibility potion"] = ["A",false,1500];
potions["pyrotic ability potion"] = ["A",false,500];
potions["revival potion"] = ["A",false,65000];
potions["speed potion"] = ["A",false,1000];
potions["telekenisys potion"] = ["A",false,500];
potions["telepathy potion"] = ["A",false,1500];
potions["treasure-smelling potion"] = ["A",false,250];
potions["universal antidote"] = ["A",false,2500];
potions["universal solvent"] = ["A",false,2000];
potions["water breathing potion"] = ["A",false,500];
potions["youth potion"] = ["A",false,40000];

var woodvalues = {ash:1, aspen:1, beech:1, bone:2, cedar:1, cypress:1, ebony:4, elm:1, fir:1, hawthorn:1, hazel:1, holly:1, ivory:10, larch:1, laurel:1, maple:1, oak:1, pine:1, redwood:1, spruce:1, willow:1, yew:1};

function randomwood() {
    let keys = Object.keys(woodvalues);
    return keys[ keys.length * Math.random() << 0];
};

var metalvalues = {"": 1, bronze:1, copper:1, gold:100, iron:1, silver:10, steel:1};

var allMaterials = ["ash","aspen","beech","bone","bronze","cedar","copper","cypress","ebony","elm","fir","gold","hawthorn","hazel","holly","iron","ivory","larch","laurel","maple","oak","pine","redwood","silver","spruce","steel","willow","yew"];

var materialOptions = {C:{copper:1}, F:{"":1}, G:{gold:100}, I:metalvalues, L:{"":1}, R:{"":1}, S:{silver:10}, W:woodvalues, "*":{"":1}};

var preciousMaterials = {gold:100, silver:10, bone:2, ebony:4, ivory:10};

var qualityCosts = {"well balanced":10, "fine":10, "very fine":20};

var balanceable = /(.*)(rapier|saber|sword|hatchet|hammer|mace|pick|morningstar| ax|javelin|trident|spear|halberd)(.*)/i;
  var fineable = /(.*)(dagger|rapier|saber|sword|hatchet| ax|javelin|trident|spear|halberd)(.*)/i;
    
class Thing {
  calcValue() {
    this.value = this.basevalue;
    if(preciousMaterials.hasOwnProperty(this.mat)) this.value *= preciousMaterials[this.mat];
    this.value *= this.balanced;
    this.value *= this.fine;
    let enchantMult = 1;
    for(let i = 0; i < this.enchant.length; i++) {
      if(this.enchant[i].name.includes("Staff")) continue;
      this.value += enchantMult * this.enchant[i];
      enchantMult *= 2;
    }
    this.value *= this.qty;
    return this.value;
  }
  
  constructor(category,name,qty =1,mat="",mod="",ench=[]) {
    // console.log("Thing constructor {"+category+"} {"+name+"} {"+ qty +"}");
    this.category = category;
    this.name = name;
    this.qty = qty;
    this.mat = mat;
    this.balanced = 1;
    if(mod.match(/balanced/i)) this.balanced = 10;
    this.fine = 1;
    if(mod.match(/very fine/i)) {
      this.fine = 20;
    } else if(mod.match(/fine/i)) {
      this.fine = 10;
    }

    this.enchant = ench;
    this.availqual = {};
    switch(this.category) {
    case "Item":
      this.table = items;
      this.name = name;
      if(name in this.table) {
        this.row = this.table[name];
      } else {
        this.row = [1,0.2,"*","*"];
      }
      this.basevalue = this.row[0];
      this.weight = qty * this.row[1];
      this.use = this.row[2];
      this.material = this.row[3];
      break;
    case "Potion":
      this.table = potions;
      if((typeof this.table[name] == "undefined") && name.endsWith("s")) name = name.slice(0, -1);
      if(typeof this.table[name] == "undefined") {
        console.log("Potion slice {"+name+"} not found");
        return;
      }
      this.row = this.table[name];
      this.basevalue = this.row[2];
      this.weight = qty * 0.2;
      this.material = "*";
      break;
    case "Weapon":
      this.table = weapons;
      this.row = this.table[name];
      this.basevalue = this.row[5];
      this.weight = qty * this.row[6];
      this.material = this.row[7];
      break;
    case "Armor":
      this.table = armors;
      this.row = this.table[name];
      this.basevalue =  this.row[2];
      this.weight = qty * this.row[3];
      this.material = this.row[6];
      this.stops = this.row[0];
      this.DXa = this.row[1];
      break;
    case "Shield":
      this.table = shields;
      this.row = this.table[name];
      this.basevalue = this.row[2];
      this.weight = qty * this.row[3];
      this.material = this.row[5];
      this.stops = this.row[0];
      this.DXa = this.row[1];
      break;
    }
    this.calcValue();
  }
  toJSON() {
    return {
      category: this.category,
      name: this.name,
      qty: this.qty,
      mat: this.mat,
      balanced: this.balanced,
      fine: this.fine,
      enchant: this.enchant
    }
  }
  
  makeSilver() {
    this.material = "S";
    this.value *= 10;
    this.mat = "silver";
  }
  listname() {
    let result = "";
    if(1 < this.qty) result += this.qty + " ";
    if(this.is_enchanted() && !this.is_staff()) result += "enchanted ";
    
    if("" !== this.mat) result += this.mat + " ";
    if(10 == this.balanced) result += "well balanced ";
    if(20 == this.fine) result += "very ";
    if(9 < this.fine) result += "fine ";
    result += this.name;
    if(1 < this.qty) result += "s";
    return result;
  }
  fullname() {
    let result = "";
    if(1 < this.qty) result += this.qty + " ";
    if(10 === this.balanced) result += "well balanced ";
    if(10 === this.fine) result += "fine ";
    if(20 === this.fine) result += "very fine ";
    if("" !== this.mat) result += this.mat + " ";
    result += this.name;
    if(1 < this.qty) result += "s";
    
    let encnt = this.enchant.length;
    if(this.is_staff()) encnt--;
    if(0 < encnt) {
      for(let i = 0; i < this.enchant.length; i++) {
        let enc = this.enchant[i];
        if(enc.includes("Staff")) continue;
        if(enc === this.name) continue;
        result += ", " +enc;
      }
    }
    return result;
  }
    
  is_staff() {
    return("mana" in this);
  }
  
  is_enchanted() {
    return(0 < this.enchant.length);
  }
  
  make_staff(spell,mana) {
    this.enchant.push(spell);
    this.mana = mana;
  }
  push_enchantment(enc) {
    if(("I" == enc.row[1]) && (0 == this.enchant.length)) {
      enc.value = 0;
      return;
    }
    for(let i = 0; i < this.enchant.length; i++) enc.value *= 2;
    this.enchant.push(enc.name);
  }
};


function sort_things(ary) {
  ary.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

class TFTWeapon extends Thing {
  calc_dam() {
    let daa = this.row[1].split("d");
    this.ddice = daa[0];
    this.dadds = daa[1];
    this.dxadj = 0;
    if(10 == this.balanced) this.dxadj = 1;
    if(10 == this.fine) this.dadds -= -1;
    if(20 == this.fine) this.dadds -= -2;
    if(['bronze', 'copper', 'iron','gold'].includes(this.mat)) this.dadds -= 1;
    this.avg = 3.5* this.ddice -(-this.dadds);
  }
  
  constructor(name,qty =1,mat="",mod="",ench=[]) {
    super("Weapon",name,qty,mat,mod,ench);
    this.talent = this.row[0];
    this.calc_dam();
  }

  minstr() {
    return this.row[3];
  }
  
  talentchk(mytal) {
    let tal = this.talent;
    if("" === tal) return false;
    if(!(tal in mytal)) return false;
    if("Knife" === tal) tal = "Dagger";
    let isExpert = false;
    if((tal+" Expertise") in mytal) isExpert = true;
    if((("rapier" === this.name) || ("saber" === this.name)) && ("Fencer" in mytal)) isExpert = true;
    if(isExpert) {
      let isMaster = false;
      if((tal+" Mastery") in mytal) isMaster = true;
      if((("rapier" === this.name) || ("saber" === this.name)) && ("Master Fencer" in mytal)) isMaster = true;
      let mod = 1;
      if(isMaster) mod = 2;
      this.adjdam(0,mod);
    }
    return true;
  }
  
  adjdam(dice, adds) {
    this.ddice -= -dice;
    this.dadds -= -adds;
    this.avg = 3.5* this.ddice -(-this.dadds);
  }

  makeBalanced() {
    let tal = this.row[0];
    if(!"Sword,Axe/Mace,Pole Weapons".includes(tal)) return false;
    this.balanced = 10;
    this.calc_dam();
    this.calcValue();
    return true;
  }

  makeFine() {
    let tal = this.row[0];
    if(!"Knife,Sword,Axe/Mace,Pole Weapons".includes(tal)) return false;
    this.fine = 10;
    this.calc_dam();
    this.calcValue();
    return true;
  }

  makeVeryFine() {
    let tal = this.row[0];
    if(!"Knife,Sword,Axe/Mace,Pole Weapons".includes(tal)) return false;
    this.fine = 20;
    this.calc_dam();
    this.calcValue();
    return true;
  }

  MakeEnchant(dx,hits) {
    let bonus = dx + hits;
    if(0 == bonus) return;
    if(5 < bonus) return;
    let enchantcost = 1000;
    for(let i = 1; i< bonus; i++) enchantcost *= 2;
    this.dxadj += dx;
    let modstr = "enchanted for ";
    if((0 < dx) && (0 < hits)) {
      modstr += "+" + dx + " DX and +" + hits +" damage";
    } else if(0 < dx) {
      modstr += "+" + dx + " DX";
    } else {
      modstr += "+" + hits +" damage";
    }
    this.enchant.push(modstr);
    if(0 < hits) this.adjdam(0,hits);
    this.calcValue();
  }
  
  listname() {
    let result = Thing.prototype.listname.call(this);
    result += " (" +this.ddice + "d";
    if(this.dadds > 0) result += "+" +this.dadds;
    if(this.dadds < 0) result += this.dadds;
    if(0 != this.dxadj) result += ", +" +this.dxadj +" DX";
    result += ")";
    return result;
  }

  is_staffable() {
    return "Knife,Quarterstaff,Sword,Pole Weapons".includes(this.row[0]);
  }

};

class Armor extends Thing {
  constructor(name,size,qty =1,mat="",mod="",ench=[]) {
    super("Armor",name,qty,mat,mod,ench);
    switch(size) {
    case "S":
      this.value *= 0.7;
      this.weight *= 0.7;
      break;
    case "L":
      this.value *= 1.3;
      this.weight *= 1.3;
      break;
    case 2:
      this.value *= 2.5;
      this.weight *= 2.5;
      break;
    case 3:
      this.value *= 4.0;
      this.weight *= 4.0;
      break;
    }
  }

  MakeEnchant(bonus) {
    if(0 == bonus) return;
    if(5 < bonus) return;
    let enchantcost = 1000;
    for(let i = 1; i< bonus; i++) enchantcost *= 2;
    this.stops += bonus;
    let modstr = "enchanted +" + bonus +" hits";
    this.enchant.push(modstr);
    this.value += enchantcost;
  }
};

class Shield extends Thing {
  constructor(name,qty =1,mat="",mod="",ench=[]) {
    super("Shield",name,qty,mat,mod,ench);
  }

  MakeEnchant(bonus) {
    if(0 == bonus) return;
    if(5 < bonus) return;
    let enchantcost = 1000;
    for(let i = 1; i< bonus; i++) enchantcost *= 2;
    this.stops += bonus;
    let modstr = "enchanted +" + bonus +" hits";
    this.enchant.push(modstr);
    this.value += enchantcost;
  }
};

function randfrac(total) {
  return Math.floor(Math.random() * total);
}

function rolldice(d) {
  tot = 0;
  for(i = 0; i < d; i++) tot += Math.ceil(Math.random() * 6);
  return tot;
}

function random_potion(budget) {
  let keys = Object.keys(potions);
  for(let i =0; i < 5; i++) {
    let name = keys[ keys.length * Math.random() << 0];
    let row = potions[name];
    if(row[2] > budget) continue;
    let pot = new Thing("Potion",name);
    if(row[1] && (budget > (25+5*row[2]))) {
      pot.name += " bomb";
      pot.value = 25+5*row[2];
      pot.weight = 2.0;
    }
    let qty = randfrac(budget / pot.value);
    if(0 < qty) {
      pot.qty = qty;
      pot.value *= qty;
      pot.weight *= qty;
      return pot;
    }
  }
  return "";
}

function reloadtal(form,ST,DX,IQ) {
  let err = "";
  let field = form.TLs;
  let length = field.options.length;
  let cl = parseInt(form.classf.value);
  for (let i = length-1; i >= 0; i--) {
    field.options[i] = null;
  }
  let at = {};
  for (let key in talents) {
    tal = talents[key];
    if(ST < tal[0]) continue;
    if(DX < tal[1]) continue;
    if(IQ < tal[2]) continue;
    at[key] = 1;
    let opt = document.createElement("option");
    opt.text = key;
    opt.value = key;
    field.add(opt,null);
  }
  field = form.LNs;
  length = field.options.length;
  for (let i = length-1; i >= 0; i--) {
    field.options[i] = null;
  }
  for (let key in languages) {
    let opt = document.createElement("option");
    opt.text = key;
    opt.value = key;
    field.add(opt,null);
  }    
  return err;
}

function reloadsp(form,IQ) {
  let err = "";
  let wizonly = /.*Staff.*/i;
  let field = form.SPs;
  let cl = parseInt(form.classf.value);
  let length = field.options.length;
  for (let i = length-1; i >= 0; i--) {
    field.options[i] = null;
  }
  let as = {};
  for (let key in spells) {
    spell = spells[key];
    if(IQ < spell[0]) continue;
    if((0 == cl) && wizonly.test(key)) continue;
    as[key] = 1;
    let opt = document.createElement("option");
    opt.text = key;
    opt.value = key;
    field.add(opt,null);
  }
  let sl = form.SPf.value;
  form.SPf.value = "";
  let sa = [];
  if("" !== sl) sa = sl.split(", ");
  let nset = new Set();
  for(let i = 0; i < sa.length; i++) {
    let key = sa[i];
    if(typeof as[key] == "undefined") {
      key = sub_spells[key];
    }
    if(typeof as[key] != "undefined") {
      nset.add(key);
      let spell = spells[key];
      let req = spell[4];
      while("" !== req) {
        if("-" === req.substring(0,1)) req = req.substring(1);
        nset.add(req);
        spell = spells[req];
        req = spell[4];
      }

    } else {
      err += "Not able to select spell {" +key +"}\n";
    }
  }
  ns = Array.from(nset);
  ns.sort(function(a, b){
    aa = a.replace(/[^A-Za-z]/gi, "");
    ba = b.replace(/[^A-Za-z]/gi, "");
    if(aa < ba) { return -1; }
    if(aa > ba) { return 1; }
    return 0;
  });
  
  tl = ns.join(", ");
  form.SPf.value = tl;
  return err;
}

function reloadat(field,min,max) {
let cur = parseInt(field.value);
let length = field.options.length;
for (let i = length-1; i >= 0; i--) {
  field.options[i] = null;
}
for(let i = min; i <= max; i++) {
let opt = document.createElement("option");
opt.text = i;
opt.value = i;
field.add(opt,null);
}
if(cur < min) cur = min;
if(cur > max) cur = max;
field.value = cur;
return cur;
}

function add_talent(form) {
  let tl = form.TLf.value;
  form.TLf.value = "";
  let ta = [];
  if("" !== tl) ta = tl.split(", ");
  let nt = form.TLs.value;
  let mt = {};
  for(let i = 0; i < ta.length; i++) mt[ta[i]] = 1;
  mt[nt] = 1;
  let tal = talents[nt];
  let req = tal[5];
  while("" !== req) {
    if("-" === req.substring(0,1)) req = req.substring(1);
    if(req in languages) {
      req = "";
    } else {
      mt[req] = 1;
      tal = talents[req];
      req = tal[5];
    }
  }
  ta = [];
  for(let key in mt) ta.push(key);
  tl = ta.join(", ");
  form.TLf.value = tl;
  price(form);
}

function del_talent(form) {
  let tl = form.TLf.value;
  form.TLf.value = "";
  let ta = [];
  if("" !== tl) ta = tl.split(", ");
  let nt = form.TLs.value;
  let mt = {};
  for(let i = 0; i < ta.length; i++) mt[ta[i]] = 1;
  let scrub = {};
  scrub[nt] = 1;
  let didscrub = true;
  while(didscrub) {
    didscrub = false;
    for(let key in mt) {
      if(typeof scrub[key] != "undefined") continue;
      if(typeof talents[key] == "undefined") continue;
      let tal = talents[key];
      let req = tal[5];
      if("-" === req.substring(0,1)) req = req.substring(1);
      if(typeof scrub[req] == "undefined") continue;
      scrub[key] = 1;
      didscrub = true;
    }
  }
  ta = [];
  for(let key in mt) {
    if(typeof scrub[key] != "undefined") continue;
    ta.push(key);
  }
  tl = ta.join(", ");
  form.TLf.value = tl;
  price(form);
}

function add_language(form) {
  let ln = form.LNf.value;
  form.LNf.value = "";
  let la = [];
  if("" !== ln) la = ln.split(", ");
  let nt = form.LNs.value;
  let mt = {};
  for(let i = 0; i < la.length; i++) mt[la[i]] = 1;
  mt[nt] = 1;
  la = [];
  for(let key in mt) la.push(key);
  la.sort();
  ln = la.join(", ");
  form.LNf.value = ln;
  price(form);
}

function del_language(form) {
  let tl = form.LNf.value;
  form.LNf.value = "";
  let ta = [];
  if("" !== tl) ta = tl.split(", ");
  let nt = form.LNs.value;
  let mt = {};
  for(let i = 0; i < ta.length; i++) mt[ta[i]] = 1;
  delete mt[nt];
  ta = [];
  for(let key in mt) {
    ta.push(key);
  }
  tl = ta.join(", ");
  form.LNf.value = tl;
  price(form);
}

function add_spell(form) {
  let sl = form.SPf.value;
  form.SPf.value = "";
  let sa = [];
  if("" !== sl) sa = sl.split(", ");
  let ns = form.SPs.value;
  let ms = {};
  for(let i = 0; i < sa.length; i++) ms[sa[i]] = 1;
  ms[ns] = 1;
  let spell = spells[ns];
  let req = spell[4];
  while("" !== req) {
    if("-" === req.substring(0,1)) req = req.substring(1);
    ms[req] = 1;
    spell = spells[req];
    req = spell[4];
  }
  sa = [];
  for(let key in ms) sa.push(key);
  sl = sa.join(", ");
  form.SPf.value = sl;
  price(form);
}

function del_spell(form) {
let sl = form.SPf.value;
form.SPf.value = "";
let sa = [];
if("" !== sl) sa = sl.split(", ");
let ns = form.SPs.value;
let ms = {};
for(let i = 0; i < sa.length; i++) ms[sa[i]] = 1;
let scrub = {};
scrub[ns] = 1;
let didscrub = true;
while(didscrub) {
didscrub = false;
for(let key in ms) {
if(typeof scrub[key] != "undefined") continue;
let spell = spells[key];
let req = spell[4];
if("-" === req.substring(0,1)) req = req.substring(1);
if(typeof scrub[req] == "undefined") continue;
scrub[key] = 1;
didscrub = true;
}
}
sa = [];
for(let key in ms) {
if(typeof scrub[key] != "undefined") continue;
sa.push(key);
}
sl = sa.join(", ");
form.SPf.value = sl;
price(form);
}

function change_race(form, race = "") {
  if("" == race) race = new Race(form.racef.value);
  
  let ST = reloadat(form.STf,race.row[0],race.row[1]);
  let DX = reloadat(form.DXf,race.row[2],race.row[3]);
  let IQ = reloadat(form.IQf,race.row[4],race.row[5]);
  price(form);
}


function row2gear(row) {
  let qty = row.cells[0].textContent;
  let gcat = row.cells[1].textContent;
  let gthing = row.cells[2].textContent;
  let gmat = row.cells[3].textContent;
  let gqua = row.cells[4].textContent;
  let gmagic = row.cells[5].textContent;
  let nthing = "";
  if("Weapon" === gcat) {
    nthing = new TFTWeapon(gthing,qty,gmat,gqua);
  } else {
    nthing = new Thing(gcat,gthing,qty,gmat,gqua);
  }
  return nthing;
}

function gear2form(row) {
  let form = window.document.forms[0];
  let g = row2gear(row);
  form.gearqty.value =  g.qty;
  form.gearcat.value = g.category;
  gear_cat(form);
  form.gearthing.value = g.name;
  gear_thing(form);
  form.gearmaterial.value = g.mat;
  form.gearbalance.value = "";
  if(10 == g.balanced) form.gearbalance.value = "well balanced";
  form.gearfine.value = "";
  if(10 == g.fine) form.gearfine.value = "fine";
  if(20 == g.fine) form.gearfine.value = "very fine";
  row.remove();
  gear_sums();
}

function clear_gear() {
  let tbdy =  document.getElementById("eqt").getElementsByTagName('tbody')[0];
  for(let i = tbdy.rows.length -1; i >= 0; i--) tbdy.deleteRow(i);
}

function gear2row(g) {
  let form = window.document.forms[0];
  let tbdy =  document.getElementById("eqt").getElementsByTagName('tbody')[0];
  const newRow = tbdy.insertRow();
  newRow.addEventListener('click', function() {gear2form(newRow);});
  let newCell = newRow.insertCell();
  let newText = document.createTextNode(g.qty);
  newCell.appendChild(newText);

  newCell = newRow.insertCell();
  newText = document.createTextNode(g.category);
    newCell.appendChild(newText);

    newCell = newRow.insertCell();
  newText = document.createTextNode(g.name);
    newCell.appendChild(newText);

      newCell = newRow.insertCell();
  newText = document.createTextNode(g.mat);
    newCell.appendChild(newText);

  newCell = newRow.insertCell();
  let gqua = "";
  let gfine = "";
  if(10 == g.fine) gfine = "fine";
  if(20 == g.fine) gfine = "very fine";
  if(1 < g.balanced) {
    let gbal = "well balanced";
    if(1 < g.fine) {
      gqua = gbal +", "+gfine;
    } else {
      gqua = gbal;
    }
  } else if(1 < g.fine) {
    gqua = gfine;
  }
  newText = document.createTextNode(gqua);
  newCell.appendChild(newText);

  let gmagic ="";
  newCell = newRow.insertCell();
  newText = document.createTextNode(gmagic);
  newCell.appendChild(newText);

  newCell = newRow.insertCell();
  newText = document.createTextNode(g.value);
  newCell.appendChild(newText);

  newCell = newRow.insertCell();
  newText = document.createTextNode(g.weight);
  newCell.appendChild(newText);

  gear_sums();
}

function add_gear(form) {
  let qty = form.gearqty.value;
  let gcat = form.gearcat.value;
  let gthing = form.gearthing.value;
  if("" === gthing) return;
  let gmat = form.gearmaterial.value;
  let gbal = form.gearbalance.value;
  let gfine = form.gearfine.value;
  let nthing = new Thing(gcat,gthing,qty,gmat,gbal+","+gfine);
  gear2row(nthing);
}

function gear_sums() {
  let form = window.document.forms[0];
  let totcst = 0;
  let totwt = 0;
  let erows =  document.getElementById("eqt").getElementsByTagName('tbody')[0].children;
  for (var r = 0, n = erows.length; r < n; r++) {
    totcst += parseFloat(erows[r].cells[6].innerHTML);
    totwt += parseFloat(erows[r].cells[7].innerHTML);
    }
  form.eqtc.value = totcst.toFixed(1);
    form.eqtw.value = totwt.toFixed(2);
  form.CSf.value = totcst.toFixed(1);
}

function gear_cat(form) {
  let gcat = window.document.forms[0].gearcat.value;
  let gt = window.document.forms[0].gearthing;
  let gm = window.document.forms[0].gearmaterial;
  let gb = window.document.forms[0].gearbalance;
  let gf = window.document.forms[0].gearfine;

  let catlist = {};
  let matlist = {};
  let qlist = {};
  let ballist = {};
  let finelist = {};
  
  switch(gcat) {
  case "Item":
    catlist = items;
    break;
  case "Potion":
    catlist = potions;
    break;
  case "Weapon":
    catlist = weapons;
    break;
  case "Armor":
    catlist = armors;
    break;
  case "Shield":
    catlist = shields;
    break;
  }
  load_options(gt,catlist);
  load_options(gm,matlist);
  load_options(gb,ballist);
  load_options(gf,finelist);
}

function gear_thing(form) {
  let gcat = window.document.forms[0].gearcat.value;
  let gthing = window.document.forms[0].gearthing.value;

  if("" === gthing) return;
  let nthing = new Thing(gcat,gthing,1);

  let matlist = materialOptions[nthing.material];
  load_options(window.document.forms[0].gearmaterial,matlist);

  let ballist = {};
  let finelist = {};
  if("Weapon" === gcat) {
    if(balanceable.test(gthing)) ballist = {"":1,"well balanced":10};
    if(fineable.test(gthing)) finelist = {"":1,"fine":10,"very fine":20};
  }
  let gb = window.document.forms[0].gearbalance;
  let gf = window.document.forms[0].gearfine;

  load_options(gb,ballist);
  load_options(gf,finelist);

}

function price(form) {
  let ch = new Person();
  ch.fromForm(form);
  ch.toForm(form);

  if(0 < ch.errors.length) {
    let err = ch.errors.join("\n");
    alert(err);
  }
} // price


function rolldie(mod) {
let roll = Math.floor((Math.random()*6)+1) +mod;
if(roll < 1) roll = 1;
if(roll > 6) roll = 6;
return roll;
}


class Person {

  constructor() {
    this.errors = [];
    this.lang = {};
    this.talents = {};
    this.bont = {};
    this.bonl = {};
    this.spells = {};
  }
  
  unarmed() {
    if("Gargoyle" === this.race.name) return "Stony hands (2d)";
    let punchdice = 0;
    let punchmod = 0;
    if("Brawling" in this.talents) punchmod = 1;
    if("Unarmed Combat V" in this.talents) {
      punchdice = 1;
      punchmod = 1;
    } else if("Unarmed Combat IV" in this.talents) {
      punchdice = 1;
      punchmod = 0;
    } else if("Unarmed Combat III" in this.talents) {
      punchmod = 3;
    } else if("Unarmed Combat II" in this.talents) {
      punchmod = 2;
    } else if("Unarmed Combat I" in this.talents) {
      punchmod = 1;
    }

    let dice = 1;
    let plus = -4;
    if(this.ST > 30) {
      plus = 1;
      dice = Math.floor((this.ST-11)/10);
    } else if(this.ST > 24) {
      plus = 3;
    } else if(this.ST > 20) {
      plus = 2;
    } else if(this.ST > 16) {
      plus = 1;
    } else if(this.ST > 8) {
      plus = Math.floor((this.ST-7)/2) -4;
    }
    plus += punchmod;
    dice += punchdice;
    let result = "";
    if("Reptile Person" === this.race.name) {
      plus += 2;
      result = "Claws (";
    } else {
      result = "Punch (";
    }
    result += dice +"d";
    if(plus >0) result += "+";
    if(plus != 0) result += plus;
    if("Reptile Person" === this.race.name) {
      result += "; doubled in HTH), Tail (1d)";
    } else {
      result += ")";
    }
    if("Centaur" === this.race.name) result += ", Kick(1d)";
    return result;
  }

  parseTalents(str) {
    str = str.replaceAll(";",",");
    let re = /[+0-9]/gi;
    str = str.replace(re,'');
    let ary = str.split(",");
    for(let i = 0; i < ary.length; i++) ary[i] = ary[i].trim();
    this.bont = {};
    let rt = this.race.row[11];
    for(let i = 0; i < rt.length; i++) {
      if(rt[i] in languages) {
        this.bonl[rt[i]] = 1;
      } else {
        this.bont[rt[i]] = 1;
      }
    }
    for (let tal in this.bont) {
      if(!ary.includes(tal)) ary.push(tal);
    }

    for(let i = 0; i < ary.length; i++) {
      let tn = ary[i].trim();
      if("" == tn) continue;
      if(tn in sub_talents) tn = sub_talents[tn];
      
      try {
        if(tn in languages) {
          let lang = new Language(tn);
          this.lang[lang.name] = lang;
        } else {
          let tal = new Talent(tn);
          if(tal.satisfy(this)) this.talents[tal.name] = tal;
        }      
      } catch (e) {
        this.errors.push(e.message);
      }
    }
  }

  parseLang(str) {
    let ary = str.split(",");
    for(let i = 0; i < ary.length; i++) ary[i] = ary[i].trim();
    this.bonl = {};
    let rt = this.race.row[11];
    if(this.wiz && this.IQ > 16) this.bonl["Sorcerers’ Tongue"] = 1;
    for(let i = 0; i < rt.length; i++) {
      if(rt[i] in languages) {
        this.bonl[rt[i]] = 1;
      } else {
        this.bont[rt[i]] = 1;
      }
    }
    for (let tal in this.bonl) {
      if(!ary.includes(tal)) ary.push(tal);
    }

    for(let i = 0; i < ary.length; i++) {
      if("" == ary[i]) continue;
      try {
        let tal = new Language(ary[i]);
        this.lang[tal.name] = tal;
      } catch (e) {
        this.errors.push(e.message);
      }
    }
  }

  parseWeapons(string) {
    this.weapons = [];
    let ary = string.split(",");
    let wepexp = new RegExp(Object.keys(weapons).join("|"), "gi");
    let tmp = Object.keys(enchantments).join("|").replace(/\u002B/g, "\\+");
    let enchexp = new RegExp(tmp, "g");
    for(let j =0; j < ary.length; j++) {
      let matches = ary[j].match(wepexp) || [];
      for(let i = 0; i < matches.length; i++) {
        let wn = matches[i].toLowerCase();
        let testwp = new TFTWeapon(wn);
        if(ary[j].match(/silver/i)) testwp.makeSilver();
        if(ary[j].match(/very fine/i)) {
          testwp.makeVeryFine();
        } else if(ary[j].match(/fine/i)) {
          testwp.makeFine();
        }
        
        this.weapons.push(testwp);
      }
    }
  }

  parseArmor(string) {
    this.protections = [];
    delete this.armor;
    delete this.shield;
    this.totprot = 0;
    let ary = string.split(",");
    let armexp = new RegExp(Object.keys(armors).join("|"), "gi");
    let shieldexp = new RegExp(Object.keys(shields).join("|"), "gi");
    let tmp = Object.keys(enchantments).join("|").replace(/\u002B/g, "\\+");
    let enchexp = new RegExp(tmp, "g");
    for(let j =0; j < ary.length; j++) {
      let matches = ary[j].match(armexp) || [];
      for(let i = 0; i < matches.length; i++) {
        let arm = matches[i].toLowerCase();
        let testarm = new Armor(arm,this.race.size());
        if(string.match(/silver/i)) testarm.makeSilver();        
        this.armor = testarm;
        this.protections[arm] = testarm.stops;
        this.totprot += testarm.stops;
      }
      matches = ary[j].match(shieldexp) || [];
      for(let i = 0; i < matches.length; i++) {
        let shd = matches[i].toLowerCase();
        let testshd = new Shield(shd);
        if(string.match(/silver/i)) testshd.makeSilver();        
        this.shield = testshd;
        this.protections[shd] = testshd.stops;
        this.totprot += testshd.stops;
      }
    }
  }

  parseEquipment(inp) {
    this.equipment = [];
    if('' === inp) return;
    let ary = inp.split(",");

    let countexp = /([0-9]+) /;
    let potexp = /.*(potion|poison|gunpowder|antidote|solvent).*/;
    
    let tmp = Object.keys(enchantments).join("|").replace(/\u002B/g, "\\+");
    let enchexp = new RegExp(tmp, "g");
    for(let j =0; j < ary.length; j++) {
      let teststr = ary[j].toLowerCase().trim();
      if("" === teststr) continue;

      let gear = null;
      let ench = [];
      
      let qty = 1;
      let matches = teststr.match(countexp)
      if(null != matches) {
        qty = 1 * matches[0];
      }

      let mat = "";
      for(var m = 0; m < allMaterials.length; m++) {
        if(teststr.includes(allMaterials[m])) {
          mat = allMaterials[m];
          break;
        }
      }

      if(potexp.test(teststr)) {
        for(let n in potions) {
          if(teststr.includes(n)) {
            gear = new Thing("Potion",n,qty);
            break;
          }
        }
      }

      let mods = [];
      for(let q in qualityCosts) {
        if(teststr.includes(q)) mods.push(q);
      }
      let modlist = mods.join(",");

      if(!gear) for(let n in weapons) {
        if(teststr.includes(n)) {
          gear = new TFTWeapon(n,qty,modlist,ench);
          break;
        }
      }

      if(!gear) for(let n in armors) {
        if(teststr.includes(n)) {
          gear = new Armor(n,this.size,qty,mat,modlist,ench);
          break;
        }
      }

      if(!gear) for(let n in shields) {
        if(teststr.includes(n)) {
          gear = new Shield(n,qty,mat,modlist,ench);
          break;
        }
      }

      if(!gear) for(let n in items) {
        if(teststr.includes(n)) {
          gear = new Thing("Item",n,qty,mat,modlist,ench);
          break;
        }
      }

      if(null == gear) {
        console.log("Found no equipment match for {" + teststr + "}");
      } else {
        this.equipment.push(gear);
      }
    }
  } // parseEquiment

  parseItems(string) {
  }
  
  sortTalents(trimList) {
    let excludes = false;
    let exc = {};
    let tl = {};
    let ta = [];
    if(trimList) {
      for(let tal in this.talents) {
        let pre = this.talents[tal].preq();
        if("" != pre) {
          if(trim_talents.test(tal)) exc[pre] = 1;
        }
      }
    }

    for(let tal in this.talents) {
      if(tal in exc) {
        excludes = true;
      } else {
        let str = tal;
        let qual = this.talents[tal].qualifier;
        if("" != qual) str += " (" +qual +")";
        tl[str] =1;
      }
    }
    for(let tal in tl) ta.push(tal);
    ta.sort();
    tl = ta.join(", ");
    return [excludes, tl];
  }
  
  parseSpells(str) {
    let ary = str.split(",");
    for(let i = 0; i < ary.length; i++) {
      let sn = ary[i].trim();
      if("" == sn) continue;
      try {
        let spl = new Spell(sn);
        if(spl.satisfy(this)) this.spells[spl.name] = spl;
      }catch (e) {
        this.errors.push(e.message);
      }
    }
  }

  sortSpells(trimList) {
    let excludes = false;
    let exc = {};
    if(trimList) {
      for(let spl in this.spells) {
        let pre = this.spells[spl].preq(); 
        if("" != pre) exc[pre] = 1;
      }
    }
    let sa = [];
    for(let spl in this.spells) {
      if(spl in exc) {
        excludes = true;
      } else {
        sa.push(spl);
      }
    }
    sa.sort();
    let sl = sa.join(", ");
    return [excludes, sl];
  }

  sortLang() {
    let sa = [];
    for(let lang in this.lang) {
      sa.push(lang);
    }
    sa.sort();
    let sl = sa.join(", ");
    return sl;
  }

  fromForm(form) {
    this.errors = [];
    this.charname = form.Namef.value;
    this.charage = form.Agef.value.replace(/[^0-9]/gi, '');
    this.race = new Race(form.racef.value);
    if("" !== this.race.error) {
      this.errors.push(this.race.error);
      return;
    }
    this.wiz = parseInt(form.classf.value);

    this.ST = parseInt(form.STf.value);
    this.DX = parseInt(form.DXf.value);
    this.adjDX = this.DX;

    this.IQ = parseInt(form.IQf.value);
    this.lang = {};
    this.talents = {};
    this.bont = {};
    this.bonl = {};
    this.spells = {};

    this.parseTalents(form.TLf.value);
    this.parseLang(form.LNf.value);
    this.parseSpells(form.SPf.value);
    this.budget = 0;
    this.load = 0;
    this.mana = form.Manaf.value;
    if("" == this.mana) this.mana = 0;
    this.protections = {};
    this.totprot = 0;

    this.weapons = [];
    this.equipment = [];
    this.magicitems = [];

    let erows =  document.getElementById("eqt").getElementsByTagName('tbody')[0].children;
    for (var r = 0, n = erows.length; r < n; r++) {
      let gear = row2gear(erows[r]);
      if("Weapon" === gear.category) {
        this.weapons.push(gear);
      } else {
        this.equipment.push(gear);
      }
      this.budget += gear.value;
      this.load += gear.weight;
    }
        
    let MAadj = 0;
    if("Running" in this.talents) MAadj = 2;
    this.MA = this.race.MA(MAadj);
    this.adjMA = this.MA;
    if("Toughness" in this.talents) {
      if("Toughness II" in this.talents) {
        this.protections["Toughness II"] = 2;
        this.totprot -= -2;
      } else {
        this.protections["Toughness"] = 1;
        this.totprot -= -1;
      }
    }
  }

  // Push a person onto a form
  toForm(form) {
    form.Namef.value = this.charname;
    form.Agef.value = this.charage;
    if(this.race.name !== form.racef.value) {
      form.racef.value = this.race.name;
      change_race(form, this.race);
    }
    form.classf.value = this.wiz;
    form.STf.value = this.ST;
    form.DXf.value = this.DX;
    form.IQf.value = this.IQ;

    reloadtal(form,this.ST,this.DX,this.IQ);
    reloadsp(form,this.IQ);
    form.CSf.value = this.budget;
    form.TLf.value = this.sortTalents(false)[1];
    form.LNf.value = this.sortLang();
    form.SPf.value = this.sortSpells(false)[1];
    clear_gear();
    
    let maxm = -1;
    if("Staff II" in this.spells) {
      maxm = this.IQ;
      if("Staff V" in this.spells) maxm = 2* this.IQ;
    }
    reloadat(form.Manaf,0,maxm);
    form.Manaf.value = this.mana;

    let base = this.race.row[0]+this.race.row[2]+this.race.row[4]+this.race.row[6];
    let AP = -(0 -this.ST - this.DX - this.IQ);
    let XP = APXP(AP,base) + 200*this.mana;
    let MP = 0;

    let ta = this.talents;
    for (let tal in ta) {
      let req = ta[tal].row[5];
      if("" === req) continue;
      if("-" === req.substring(0,1))
      {
        req = req.substring(1);
        if(req in languages) {
          this.bonl[req] = 1;
        } else {
          this.bont[req] = 1;
        }
      }
    }
    for (let tal in ta) {
      if(tal in this.bont) continue;
      MP += ta[tal].row[3+ this.wiz];
    }
    if(("Detect Traps" in ta) && ("Alertness" in ta)) MP -= (1+this.wiz);
    if(("Remove Traps" in ta) && ("Mechanician" in ta)) MP -= (1+this.wiz);
    if(("Physicker" in ta) && ("Vet" in ta)) MP -= (1+this.wiz);

    let sa = this.spells;
    let bons = {};
    for(let sp in sa) {
      let spl = sa[sp];
      let req = spl.row[4];
      if("" === req) continue;
      if("-" === req.substring(0,1)) bons[sp] = 1;
    }

    for(let sp in sa) {
      if(sp in bons) continue;
      MP += 3 - 2*this.wiz;
    }

    for (let lang in this.lang) {
      if(lang in this.bonl) continue;
      MP++;
    }

    let gearFields = {
      WPf: "weapons",
//      ARf: "armor",
      EQf: "equipment",
      MIf: "magicitems"
    };

    let itar = [];

    for(let fld in gearFields) {      
      let prop = gearFields[fld];
      for(let it in this[prop]) {
        gear2row(this[prop][it]);
      }
    }
    
    if(MP > this.IQ) XP += 500 * (MP - this.IQ);
    if(base > AP) XP -= 100*(base - AP);
    form.XPf.value = XP;
    XP += form.CSf.value / 10;
    let CP = AP;
    if(XP > 0) CP = base + (XP/100);
    form.APf.value = AP;
    form.MPf.value = "" +MP +"/" +this.IQ;
    form.CPf.value = CP;
  }

  // Parse a character from Roll20
  fromRoll20(input) {
    this.errors = [];
    this.lang = {};
    this.talents = {};
    this.spells = {};
    this.budget = 1000;
    this.charage = 20;
    
    let wizMatch = /wizard/gi;
    this.wiz = 0;
    if(wizMatch.test(input)) this.wiz = 1;
    
    input = input.replaceAll(",\n",", ");
    input = input.replaceAll("/\n","/");
    let lines = input.split("\n");
    let ln =0;
    while(ln < lines.length) {
      lines[ln] = lines[ln].trim();
      ln++
    }
    ln = 0;
    while(!lines[ln].startsWith("Name")) ln++;
    this.charname = lines[++ln];
    while(!lines[ln].startsWith("Age")) ln++;
    this.charage = lines[++ln].replace(/[^0-9]/gi, '');
    while(!lines[ln].startsWith("Race")) ln++;
    let racename = lines[++ln];
    this.race = new Race(racename);
    if("" !== this.race.error) {
      this.errors.push(this.race.error);
      return;
    }
    // ignore gender can o worms
    while(!lines[ln].startsWith("ST")) ln++;
    this.ST = lines[++ln];
    while(!lines[ln].startsWith("DX")) ln++;
    this.DX = lines[++ln];
    while(!lines[ln].startsWith("IQ")) ln++;
    this.IQ = lines[++ln];
    while(!lines[ln].startsWith("Talent")) ln++;
    let talstr = "";
    while(!lines[++ln].startsWith("Attack")) {
      if("" ===  lines[ln]) continue;
      if(!(lines[ln] in talents)) continue;
      if("" !== talstr) talstr += ", ";
      talstr += lines[ln];
    }
    this.parseTalents(talstr);

    while(!lines[ln].startsWith("Spell")) ln++;
    ln += 5;
    let spellstr = "";
    while(!lines[++ln].startsWith("Armor")) {
      if("" ===  lines[ln]) continue;
      if(!(lines[ln] in spells)) continue;
      if(lines[ln].startsWith("Staff")) this.wiz = 1;
      if("" !== spellstr) spellstr += ", ";
      spellstr += lines[ln];
    }
    this.parseSpells(spellstr);
    
  } // fromRoll20
  
  // Parse a character from text block
  fromText(input) {
    this.errors = [];
    this.lang = {};
    this.talents = {};
    this.spells = {};
    this.budget = 1000;
    this.charage = 20;

    if(input.startsWith("Character Sheet")) {
      this.fromRoll20(input);
      return;
    }
    let reMana = /[^a-z]Mana[^0-9]{1,10}([0-9]+)[^0-9].*/si;
    if(reMana.test(input)) {
      this.mana = RegExp.$1;
    }
    let statMatch = /(.*)ST[^0-9]*([0-9]+).{1,10}DX[^0-9]*([0-9]+).{1,10}IQ[^0-9]*([0-9]+)(.*)/si;
    if(!statMatch.test(input)) {
      this.errors.push("Please enter stats in the format area");;
    }
    let header = RegExp.$1;
    this.ST = RegExp.$2;
    let oldST = this.ST;
    this.DX = RegExp.$3;
    let oldDX = this.DX;
    this.IQ = RegExp.$4;
    let oldIQ = this.IQ;
    input = RegExp.$5;
    
    input = input.replaceAll(",\n",", ");
    input = input.replaceAll("/\n","/");
    let lines = input.split("\n");
    let ln =0;
    let tot = lines.length;
    while(ln < tot && "" === lines[ln]) ln++;
    if(ln >= tot) {
      this.errors.push("Please enter a character in the format area");
      return;
    }

    let classMatch = /(.*)(hero|wizard)(.*)/i;
    let ageMatch = /(.*)age[^0-9]*([0-9]+)(.*)/i;
    this.wiz = 0;
    this.charname = "";
    this.race = new Race("Human");
    if(ageMatch.test(header)) {
      header = RegExp.$1;
      this.charage = RegExp.$2;
    }
    if(raceMatch.test(header)) {
      this.charname = RegExp.$1;
      header = RegExp.$3;
      let racename = RegExp.$2;
      if("half-" == this.charname.substr(-5)) {
        this.charname = this.charname.substr(0,this.charname.length-5);
        racename = "Half-" + racename;
      }
      this.race = new Race(racename);
      if("" !== this.race.error) {
        this.errors.push(this.race.error);
        return;
      }
    }
    if(classMatch.test(header)) {
      header = "";
      this.charname += RegExp.$1 +RegExp.$3;
      let cls = RegExp.$2[0];
      if(("w" === cls) || ("W" === cls)) this.wiz = 1;
    }
    this.charname += header;
    let check = this.charname.substr(-1);
    while((" " === check) || ("," === check)) {
      this.charname = this.charname.substr(0,this.charname.length-2);
      check = this.charname.substr(-1);
    }
    while(ln < tot) {
      let buff = "";
      let str = lines[ln];
      let split = str.indexOf(":");
      if(-1 == split) {
        ln++;
        continue;
      }
      let title = str.substr(0,split);
      buff += str.substr(split+1);
      ln++;
      while(ln < tot) {
        str = lines[ln];
        let split = str.indexOf(":");
        if(-1 != split) break;
        buff += " " +str;
        ln++;
      }
      const hexfix = /-hex/g;
      buff = buff.replace(hexfix,"-Hex");

      let parsefunc = {
        parseTalents: /skills|talent|language/gi,
        parseSpells: /spell/gi,
        parseWeapons: /weapon/gi,
        parseArmor: /armor/gi,
        parseEquipment: /equipment/gi,
        parseItems: /magic item/gi
      };
      buff = buff.replaceAll(".","");
      for(let fun in parsefunc) {
        if(parsefunc[fun].test(title)) {
          this[fun](buff);
        }
      }
    }
    if(oldST < this.ST) this.errors.push("Raised ST from " +oldST +" to " +this.ST);
    if(oldDX < this.DX) this.errors.push("Raised DX from " +oldDX +" to " +this.DX);
    if(oldIQ < this.IQ) this.errors.push("Raised IQ from " +oldIQ +" to " +this.IQ);
  }
  
  rand_gear() {
    let thng = "";
    let maxload = 3.0 * this.ST;
    let myarm = "";
    if("Gargoyle" !== this.race.name) for(let arm in armors) {
      let maxpen = rolldice(4) - this.DX;
      let tospend = randfrac(this.budget/2);
      let tocarry = randfrac(maxload - this.load);
      let testarm = new Armor(arm,this.race.size());
      if((!this.wiz) && (testarm.name.includes("robe"))) continue;
      if(maxpen > testarm.DXa) continue;
      if(tospend < testarm.value) continue;
      if(tocarry < testarm.weight) continue;
      if(((this.wiz) || (0 == randfrac(10))) && ("I" == testarm.material)) testarm.makeSilver();
      if(tospend < testarm.value) continue;
      let bonus = 0;
      let enctcst = 1000;
      let avail = tospend - testarm.value;
      while((enctcst < avail) && (bonus < 6)) {
        bonus += 1;
        enctcst *= 2;
      }
      if(0 < bonus) testarm.MakeEnchant(bonus);
      myarm = testarm;
    }
    if("" !== myarm) {
      this.armor = myarm;
      if(0 < myarm.enchant.length) this.magicitems.push(myarm);
      if(0 < myarm.stops) this.protections[myarm.listname()] = myarm.stops;
      this.totprot -= -myarm.stops;
      this.adjDX -= -myarm.DXa;
      let speedAdj = myarm.row[4];
      if(10 != speedAdj) {
        if(8 == speedAdj) {
          this.adjMA = this.race.MA(-2);
        } else {
          this.adjMA = speedAdj;
        }
      }
      this.budget -= myarm.value;
      this.load -= -myarm.weight;
    }

    let myshield = "";
    if("Shield" in this.talents) {
      for(let sh in shields) {
        let maxpen = rolldice(4) -this.adjDX;
        let tospend = randfrac(this.budget/3);
        let tocarry = randfrac(maxload - this.load);
        let testshd = new Shield(sh);
        if(maxpen > testshd.DXa) continue;
        if(tospend < testshd.value) continue;
        if(tocarry < testshd.weight) continue;
        if(((this.wiz) || (0 == randfrac(10))) && ("I" == testshd.material)) testshd.makeSilver();
        if(tospend < testshd.value) continue;
        let bonus = 0;
        let enctcst = 1000;
        let avail = tospend - testarm.value;
        while((enctcst < avail) && (bonus < 6)) {
          bonus += 1;
          enctcst *= 2;
        }
        if(0 < bonus) testshd.MakeEnchant(bonus);
        if("Shield Expertise" in this.talents) testshd.stops++;
        myshield = testshd;
      }
    }
    if("" !== myshield) {
      this.shield = myshield;
      if(0 < myshield.enchant.length) this.magicitems.push(myshield);
      this.protections[myshield.listname()] = myshield.stops;
      this.adjDX -= -myshield.DXa;
      this.budget -= myshield.value;
      this.load -= myshield.weight;
      this.totprot -= -myshield.stops;
    }

    let mywp = [];
    for(let wn in weapons) {
      let testwp = new TFTWeapon(wn);
      if(this.ST < testwp.minstr()) continue;
      let tospend = randfrac(randfrac(this.budget/2));
      if(((this.wiz) || (0 == randfrac(10))) && ("I" == testwp.material)) testwp.makeSilver();
      let tocarry = randfrac(maxload - this.load);
      if(testwp.value > tospend) continue;
      if(testwp.weight > tocarry) continue;
      if(!testwp.talentchk(this.talents)) continue;
      if((rolldice(3) > this.DX) && ((10 * testwp.value) < tospend)) testwp.makeBalanced();
      if((10 * testwp.value) < tospend) {
        if((20 * testwp.value) < tospend) {
          testwp.makeVeryFine();
        } else {
          testwp.makeFine();
        }
      }
      let bonus = 0;
      let enchantcost = 1000;
      while((bonus <= 5) && (enchantcost < (tospend - testwp.value))) {
        bonus++;
        enchantcost *= 2;
      }
      let dxbonus = 0;
      for(let i = 0; i < bonus; i++) {
        if(rolldice(3) > (dxbonus+this.DX)) dxbonus++;
      }
      if(0 < bonus) testwp.MakeEnchant(dxbonus,bonus - dxbonus);
      let avg = 0;
      let tal = testwp.talent;
      if(typeof mywp[tal] !== "undefined") avg = mywp[tal].avg;
      if(testwp.avg > avg) mywp[tal] = testwp;
    }

    let staffspell = "";
    if("Staff" in this.spells) {
      staffspell = "Staff";
      for(let i = 1; i < 5; i++) {
        if(staff_spells[i] in this.spells) {
          staffspell = staff_spells[i];
        }
      }
    }
    for(let wt in mywp) {
      let weap = mywp[wt];
      if(weap.value > this.budget) continue;
      if(("" !== staffspell) && weap.is_staffable()) {
        weap.make_staff(staffspell,this.mana);
        staffspell = "";
      }
      if(0 < weap.enchant.length) this.magicitems.push(weap);
      this.weapons.push(weap);
      this.budget -= weap.value;
      this.load -= -weap.weight;
    }

    if("" !== staffspell) {
      let wn = "wand";
      if(3 < randfrac(maxload - this.load)) wn = "cane";
      if(3 < randfrac(maxload - this.load)) wn = "club";
      if(5 < randfrac(maxload - this.load)) wn = "maul";
      let weap = new TFTWeapon(wn);
      weap.name = randomwood() +" "+ weap.name;
      weap.make_staff(staffspell,this.mana);
      staffspell = "";
      mywp["Staff"] = weap;
      this.weapons.push(weap);
      this.magicitems.push(weap);
      this.budget -= weap.value;
      this.load -= -weap.weight;
    }
    let needarrows = false;
    let needquarrels = false;
    let ammo = "";
    let bow = "";
    for(let wt in mywp) {
      let weap = mywp[wt];
      if("small bow,horse bow,longbow".includes(weap.name)) {
        needarrows = true;
        bow = weap;
      }
      if(weap.name.includes("crossbow")) {
        needquarrels = true;
        bow = weap;
      }
      if("bola" === weap.name) ammo = weap;
      if("sling" === weap.name) bow = weap;
    }

    let isil = false;
    let basecost = 20;
    if((this.wiz) || (0 == randfrac(10))) {
      isil = true;
      basecost *= 10;
    }
    if(needarrows && (basecost < this.budget)) {
      ammo = "arrow";
      let arw = new Thing("Item",ammo,20);
      if(isil) arw.makeSilver();
      this.equipment.push(arw);
      this.budget -= arw.value;
      this.load -= -arw.weight;
    }
    if(needquarrels && (basecost < this.budget)) {
      ammo = "quarrel";
      let arw = new Thing("Item",ammo,20);
      if(isil) arw.makeSilver();
      this.equipment.push(arw);
      this.budget -= arw.value;
      this.load -= -arw.weight;
    }
    if(("Pathfinder" in this.spells) && (200 < this.budget)) {
      thng = new Thing("Item","small silver mirror",1);
      this.equipment.push(thng);
      this.budget -= thng.value;
      this.load -= -thng.weight;
    }
    if(("Scrying" in this.spells) && (200 < this.budget)) {
      thng = new Thing("Item","pointer necklace",1);
      this.equipment.push(thng);
      this.budget -= thng.value;
      this.load -= -thng.weight;
    }
    let tospend = randfrac(this.budget/4);
    if(("Explosive Gem" in this.spells) && (250 < tospend)) {
      let qty = Math.floor(tospend / 250);
      if(5 < qty) qty = 5;
      thng = new Thing("Item","gem",qty);
      thng.mods.push("8d explosive");
      thng.value -= -200 * qty;
      this.equipment.push(thng);
      this.budget -= thng.value;
      this.load -= -thng.weight;
    }
    let maxencht = 10;
    for(let i = 0; i < maxencht; i++) {
      let enc = random_enchantment(randfrac(this.budget));
      if("" === enc) continue;
      switch (enc.material()) {
      case "*":
        let wearables = ["Amulet","Boots","Helm","Quiver"];
        let worn = {};
        let wornie = "";
        for(let w of wearables) {
          if(enc.name.includes(w)) {
            wornie = w;
          }
        }
        if(("" !== wornie) && (wornie in worn)) {
          if("Quiver" == wornie) continue;
          thng = worn[wornie];
          thng.push_enchantment(enc);
          thng.value += enc.value;
          this.budget -= enc.value;
        } else {
          thng = new Thing("Item",enc.name,1);
          thng.name = enc.name;
          thng.push_enchantment(enc);
          thng.value = enc.value;
          this.magicitems.push(thng);
          this.budget -= thng.value;
          this.load -= -thng.weight;
          if("" !== wornie) worn[wornie] = thng;
        }
        break;
      case "M":
        switch(ammo) {
        case "":
          thng = new Thing("Item","silver ring",1);
          thng.push_enchantment(enc);
          thng.value += enc.value;
          this.magicitems.push(thng);
          this.budget -= thng.value;
          this.load -= -thng.weight;
          break;

        case "arrow":
        case "quarrel":
          let arw = new Thing("Item",ammo,20);
          if(isil) arw.makeSilver();
          arw.push_enchantment(enc);
          arw.value += enc.value;
          this.equipment.push(arw);
          this.budget -= arw.value;
          this.load -= -arw.weight;
          break;

        default:
          ammo.push_enchantment(enc);
          ammo.value += enc.value;
          this.budget -= enc.value;
          break;
        }
        break;
      case "B":
        if("" === bow) continue;
        bow.push_enchantment(enc);
        bow.value += enc.value;
        this.budget -= enc.value;
        break;
      case "A":
        if(!"armor" in this) continue;
        this.armor.push_enchantment(enc);
        this.armor.value += enc.value;
        this.budget -= enc.value;
        break;
      case "R":
        thng = new Thing("Item","silver ring",1);
        thng.push_enchantment(enc);
        thng.value += enc.value;
        this.magicitems.push(thng);
        this.budget -= thng.value;
        this.load -= -thng.weight;
        break;
      case "W":
        if(0 == this.weapons.length) continue;
        let weap = this.weapons[0];
        weap.push_enchantment(enc);
        weap.value += enc.value;
        this.budget -= enc.value;
        break;
      default:
        if(0 < this.weapons.length) thng = this.weapons[0];
        if("armor" in this) thng = this.armor;
        if("shield" in this) thng = this.shield;
        if("" === thng) {
          thng = new Thing("Item","silver ring",1);
          this.budget -= thng.value;
          this.load -= -thng.weight;
        }
        thng.push_enchantment(enc);
        this.budget -= enc.value;
        thng.value -= -enc.value;
        if(!this.magicitems.includes(thng)) this.magicitems.push(thng);
        break;
      
      }
    }

    let tocarry = randfrac(maxload - this.load);
    tospend = randfrac(this.budget);
    for(let i = 0; i < 5; i++) {
      let pot = random_potion(tospend);
      if("" === pot) break;
      if((pot.name === "Gunpowder charge") && (!"Guns" in this.talents)) continue;
      if(tocarry < pot.weight) break;
      this.equipment.push(pot);
      this.budget -= pot.value;
      tospend -= pot.value;
      this.load -= -pot.weight;
      tocarry -= pot.weight;
    }
    tocarry = maxload - this.load;
    if(0 < this.budget) this.equipment.push(new Thing("Item","coin",this.budget,"silver"));
  }

  format_stats() {
    let result = this.charname +", " +this.race.name;
    if(this.wiz) result += " wizard";
    result += ", age "+this.charage+"\n";
    result += "ST " + this.ST +", DX " + this.DX;
    if(this.adjDX != this.DX) result += " (" + this.adjDX + ")";
    result += ", IQ "+ this.IQ + ", MA " + this.MA;
    if(this.adjMA !== this.MA) result += " (" + this.adjMA + ")";
    result += "\n";

    let sortList = this.sortTalents(true);
    let excludes = sortList[0];
    let tl = sortList[1];
    if("" !== tl) {
      if(excludes || tl.includes(",")) {
        result += "Talents";
        if(excludes) result += " include";
        result += ": ";
      } else {
        result += "Talent: ";
      }
      result += tl +"\n";
    }

    let sortedSpells = this.sortSpells(true);
    excludes = sortedSpells[0];
    let sl = sortedSpells[1];

    if("" !== sl) {
      if(excludes || sl.includes(",")) {
        result += "Spells";
        if(excludes) result += " include";
        result += ": ";
      } else {
        result += "Spell: ";
      }
      result += sl +"\n";
    }

    let ll = this.sortLang();
    if("" !== ll) {
      if(ll.includes(",")) {
        result += "Languages: ";
      } else {
        result += "Language: ";
      }
      result += ll +"\n";
    }

    let wpar = [];
    for(let wep in this.weapons) {
      wpar.push(this.weapons[wep].listname());
    }
    let wpstr = wpar.join(", ");
    if("" !== wpstr) {
      if(wpstr.includes(",")) {
        result += "Weapons: ";
      } else {
        result += "Weapon: ";
      }
      result += wpstr +"\n";
    }

    result += "Attacks and Damage: "+this.unarmed()+"\n";
    result += "Special Ability/Weakness: \n";
    result += "Armor:";
    if(0 < this.totprot) {
      let armstr = "";
      for (let key in this.protections) armstr += key +", ";
      armstr = armstr.substring(0, armstr.length - 2);
      let lastIndex = armstr.lastIndexOf(", ");
      let stopstr = "stops"
      if(-1 != lastIndex) {
        stopstr = "stop"
        let beginString = armstr.substring(0, lastIndex);
        let endString = armstr.substring(lastIndex + 2);
        armstr = beginString + ", and " +endString;
      }
      armstr = armstr.charAt(0).toUpperCase() + armstr.slice(1);
      result += " " +armstr + " " +stopstr + " "+ this.totprot +" hit";
      if(1 < this.totprot) result += "s";
    }
    result += "\n";
    sort_things(this.equipment);
    let eq = [];
    for(let i = 0; i < this.equipment.length; i++) eq.push(this.equipment[i].fullname());
    let es = eq.join(", ");
    result += "Equipment: "+es+"\n";
    if(0 < this.magicitems.length) {
      result += "Magic Items:\n";
      for(let i = 0; i < this.magicitems.length; i++) {
        result += " • " +this.magicitems[i].fullname()
          +", value $" +this.magicitems[i].value
          +"\n";
      }
    }
    result += "Special note:\n";
    return result;
  } // format_stats
  
};

function random_gear(form) {
  let ch = new Person();
  ch.fromForm(form);
  ch.rand_gear();
  form.statblock.value = ch.format_stats();
  ch.toForm(form);
}


function format_stats(form) {
  let ch = new Person();
  ch.fromForm(form);
  form.statblock.value = ch.format_stats();
}

function parse_stats(form) {
  let ch = new Person();
  ch.fromText(form.statblock.value);
  if(0 < ch.errors.length) {
    let err = ch.errors.join("\n");
    alert(err);
  }
  ch.toForm(form);
}

function canstore() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}


function loadPeople() {
let row = document.getElementById("storageRow");
if(!canstore()) {
row.style.display = 'none';
} else {
  row.style.display = '';
  let x = document.getElementById("savedUnits");
  while(0 < x.length) {
    x.remove(0);
  }
  unitArray = new Object;

  let sauce = localStorage["unitArray"];
  if('' < sauce) {
    unitArray = JSON.parse(sauce);

    for(let uName in unitArray) {
      let option=document.createElement("option");
      option.text=uName;
      x.add(option,null);
    }
  } // if any units in array
} // if can store units
}// loadUnits

function storeUnit(f) {
  let uName = f.unitName.value;
  if('' < uName) {
    let u = formunit(f);
    unitArray[uName] = u;
    localStorage["unitArray"] = JSON.stringify(unitArray);
    loadUnits();
    price(f);
  }
} // storeUnit

function deleteUnit(f) {
  let index = f.savedUnits.selectedIndex;
if(0 > index) return;

  let uName = f.savedUnits.options[index].value;
  if('' < uName) {
    delete unitArray[uName];
    localStorage["unitArray"] = JSON.stringify(unitArray);
    loadUnits();    
  }
} // deleteUnit
