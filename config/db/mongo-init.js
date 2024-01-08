print("Start #################################################################");

db = db.getSiblingDB("metrics");
db.createCollection("issues");
db.createCollection("hotspots");
db.createCollection("measures");
db.createCollection("commits");

print("END #################################################################");
