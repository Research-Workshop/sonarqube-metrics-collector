module.exports = {
    async up(db, client) {
        // rename a collection
        await db.renameCollection("issues_statuses", "issue_changes");
        // create a collection
        await db.createCollection("hotspot_changes");
        await db.createCollection("commit_issues");
    },

    async down(db, client) {
    }
};
