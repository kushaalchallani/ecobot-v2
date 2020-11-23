/* eslint-disable quotes */
require("dotenv/config");
const Command = require("../../structures/bases/commandBase");
const { tagModel } = require("../../database/models/export/index");
const moment = require("moment");
const tagRegex = RegExp(/^"([^]+?)(?:" "([^]+))?"$/);
const hoistedRegex = RegExp(/(\s+)?--(un)?hoist/);
const Embed = require("../../structures/embed");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "tag",
            description: "Create Custom command with aliases",
            category: "Settings",
            cooldown: 20,
            nsfw: false,
            ownerOnly: false,
            guildOnly: true,
            memberPermission: ["ADMINISTRATOR", "MANAGE_SERVER"],
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            aliases: ["cc", "customcommands"],
            usage: "<method> <...arguments>",
            subcommands: [
                "• add [--hoist/--unhoist] <tag> <content>",
                "• del <tag>",
                "• alias <--add/--del> <tag> <alias>",
                "• edit [--hoist/--unhoist] <tag> <content>",
                "• rename <tag> <name>",
                "• show <tag>",
                "• info <tag>",
                "• search <tag>",
                "• list [member]",
            ],
            examples: [
                "tag add Test Test",
                "tag add --hoist Test1 Test1",
                'tag add --hoist "Test 2" "Test 3"',
                'tag add "Test 1" "Test 1"',
                "tag del Test",
                "tag del @Gogeta#2849",
                "tag alias --add Test1 Test2",
                'tag alias --del "Test 2" "Test 3"',
                'tag edit "Test 1" "New Tag Content"',
                'tag edit --hoist "Test"',
                'tag edit --unhoist "Test 1" "Test 2"',
                "tag edit New Tag Content",
                "tag rename Test1 Test2",
                'tag rename "Test 1" "Test 2"',
                "tag show Test",
                "tag info Test",
                "tag search Test",
                "tag list",
                "tag list @Gogeta#2849",
            ],
        });
    }

    async execute(message, args) {
        const tagMethod = args[0] ? args[0].toLowerCase() : "";

        switch (tagMethod) {
            case "add":
                return this.addTag(args.slice(1), message);
            case "del":
                return this.delTag(args.slice(1).join(" "), message);
            case "edit":
                return this.editTag(args.slice(1), message);
            case "rename":
                return this.renameTag(args.slice(1), message);
            case "show":
                return this.showTag(args.slice(1).join(" "), message);
            case "alias":
                return this.aliasesTag(args.slice(2), args[1], message);
            case "info":
                return this.infoTag(args.slice(1).join(" "), message);
            case "search":
                return this.tagSearch(args.slice(1).join(" "), message);
            case "list":
                return this.listTags(args.slice(1).join(" "), message);
        }

        if (!tagMethod) {
            return message.channel.send(
                new Embed()
                    .setDescription(
                        `
            • add [--hoist/--unhoist] <tag> <content>
            • del <tag>
            • alias <--add/--del> <tag> <alias>
            • edit [--hoist/--unhoist] <tag> <content>
            • rename <tag> <name>
            • show <tag>
            • info <tag>
            • search <tag>
            • list [member]`
                    )
                    .setColor("BLUE")
                    .setTitle("Available Methods")
            );
        }
    }

    async addTag(args, message) {
        const tagData = this.getTagData(args, true);
        const tagHoisted = tagData[0] || false;
        let tagName = tagData[1];
        let tagContent = tagData[2];
        if (this.canModifyTag(message.member, null))
            return message.channel.send("You can't create tags as you have been restricted.");
        if (!tagName) tagName = await this.awaitMessages(message, "What do you want the tag name to be?");
        if (!tagName) return;
        if (await this.getTag(message.guild, tagName))
            return message.channel.send("There is already a tag with this name.");
        if (tagName.length >= 50) return message.channel.send("You can't name your tag over 50 characters long.");
        if (!tagContent) tagContent = await this.awaitMessages(message, "What do you want the tag content to be?");

        if (tagContent) {
            if (tagContent.length >= 1900)
                return message.channel.send("You tag content can't be over 1900 characters.");
            const tagDoc = new tagModel({
                guildID: message.guild.id,
                tagName: tagName,
                tagContent: tagContent,
                tagCreator: message.member.id,
                tagHoisted: tagHoisted,
                tagCreated: Date.now(),
            });

            await tagDoc.save().catch(console.error);
            message.channel.send(`Successfully created the tag **${tagName}**`);
        }
    }

    async delTag(tagName, message) {
        if (!tagName) tagName = await this.awaitMessages(message, "What tag do you want to delete?");
        const mentionedUser = await this.client.util.getMentions().user(tagName);

        if (tagName) {
            if (mentionedUser && message.member.hasPermission("ADMINISTRATOR")) {
                let tagDoc = await this.getTag(message.guild, null, true);
                tagDoc = tagDoc.filter((tag) => tag.tagCreator === mentionedUser.id);
                if (!tagDoc.length) return message.channel.send("This member hasn't created any tags.");
                for (const tag of tagDoc) {
                    await tag.deleteOne().catch(console.error);
                }
                message.channel.send(`Successfully deleted all tags from **${mentionedUser.tag}**`);
            } else {
                const tagDoc = await this.getTag(message.guild, tagName);
                if (!tagDoc) return message.channel.send("There is no tag with this name.");
                if (this.canModifyTag(message.member, tagDoc.tagCreator))
                    return message.channel.send("You don't have permissions to delete this tag.");
                await tagDoc.deleteOne().catch(console.error);
                message.channel.send(`Successfully deleted the tag **${tagName}**`);
            }
        }
    }

    async editTag(args, message) {
        const tagData = this.getTagData(args, true);
        const tagHoisted = tagData[0];
        let tagName = tagData[1];
        let tagContent = tagData[2];
        if (!tagName) tagName = await this.awaitMessages(message, "What tag do you want to edit?");
        if (tagName && !tagContent && tagHoisted === undefined)
            tagContent = await this.awaitMessages(message, "What do you want to edit the tag content to?");

        const tagDoc = await this.getTag(message.guild, tagName);
        if (!tagDoc) return message.channel.send("There is not tag with this name.");
        if (this.canModifyTag(message.member, tagDoc.tagCreator))
            return message.channel.send("You don't have permissions to edit this tag.");
        if (tagContent && tagContent.length >= 1900)
            return message.channel.send("You tag content can't be over 1900 characters.");
        if (tagContent) await tagDoc.updateOne({ tagContent: tagContent }).catch(console.error);
        if (tagHoisted) await tagDoc.updateOne({ tagHoisted: tagHoisted }).catch(console.error);
        await this.updateLastModified(message.member, tagDoc);
        message.channel.send(`Successfully edited the tag **${tagName}**`);
    }

    async renameTag(args, message) {
        const tagData = this.getTagData(args);
        let tagName = tagData[0];
        let rename = tagData[1];
        if (!tagName) tagName = await this.awaitMessages(message, "What tag do you want to rename?");
        if (tagName && !rename) rename = await this.awaitMessages(message, "What do you want to rename this tag to?");

        if (rename) {
            const tagDoc = await this.getTag(message.guild, tagName);
            if (!tagDoc) return message.channel.send("There is no tag with this name.");
            if (this.canModifyTag(message.member, tagDoc.tagCreator))
                return message.channel.send("You don't have permissions to rename this tag.");
            if (await this.getTag(message.guild, rename))
                return message.channel.send("There is already a tag with this name.");
            if (rename.length >= 50) return message.channel.send("You can't name your tag over 50 characters long.");
            await tagDoc.updateOne({ tagName: rename });
            await this.updateLastModified(message.member, tagDoc);
            message.channel.send(`Successfully renamed the tag **${tagName}**`);
        }
    }

    async aliasesTag(args, aliasMethod, message) {
        if (!["--add", "--del"].includes(aliasMethod))
            return message.channel.send("That's not a valid tag alias method.");
        const tagData = this.getTagData(args);
        let tagName = tagData[0];
        let alias = tagData[1];
        if (!tagName)
            tagName = await this.awaitMessages(
                message,
                `What tag do you want to ${aliasMethod === "--add" ? "add an alias too?" : "delete an alias from?"}`
            );
        if (tagName && !alias)
            alias = await this.awaitMessages(
                message,
                `What alias do you want ${aliasMethod === "--add" ? "add??" : "delete?"}`
            );

        if (alias) {
            const tagDoc = await this.getTag(message.guild, tagName);
            if (this.canModifyTag(message.member, tagDoc.tagCreator))
                return message.channel.send("You don't have permissions to edit this tag.");
            if (!tagDoc) return message.channel.send("There is no tag with that name.");

            switch (aliasMethod) {
                case "--add":
                    if (await this.getTag(message.guild, alias))
                        return message.channel.send("There is already a tag with this name.");
                    if (alias.length >= 50) return message.channel.send("You tag alias can't be over 50 characters.");
                    tagDoc.tagAliases.push(alias);
                    await tagDoc.save().catch((err) => console.log(err));
                    await this.updateLastModified(message.member, tagDoc);
                    return message.channel.send(`Successfully added the alias **${alias}**`);
                case "--del":
                    const aliasIndex = tagDoc.tagAliases.indexOf(alias); // eslint-disable-line no-case-declarations
                    if (aliasIndex === -1) return message.channel.send(`There is no alias with the name **${alias}**`);
                    aliasIndex === 0 ? tagDoc.tagAliases.shift() : tagDoc.tagAliases.splice(aliasIndex, aliasIndex);
                    await tagDoc.save().catch((err) => console.log(err));
                    await this.updateLastModified(message.member, tagDoc);
                    return message.channel.send(`Successfully deleted the alias **${alias}**`);
            }
        }
    }

    async showTag(tagName, message) {
        if (!tagName) tagName = await this.awaitMessages(message, "What tag do you want to show?");

        if (tagName) {
            const tagDoc = await this.getTag(message.guild, tagName);
            if (!tagDoc) return message.channel.send("That is not a valid tag name.");
            message.channel.send(tagDoc.tagContent);
        }
    }

    async infoTag(tagName, message) {
        if (!tagName) tagName = await this.awaitMessages(message, "What tag do you want info on?");

        if (tagName) {
            const tagDoc = await this.getTag(message.guild, tagName);
            if (!tagDoc) return message.channel.send("There is no tag with this name.");
            const createdBy = await this.client.users.fetch(tagDoc.tagCreator).catch(() => null);

            const embed = new Embed()
                .setColor("BLUE")
                .addField("❯ Name", tagDoc.tagName)
                .addField("❯ Created By", createdBy ? `${createdBy.tag} (ID: ${createdBy.id})` : "Deleted User")
                .addField(
                    "❯ Aliases",
                    tagDoc.tagAliases.length ? tagDoc.tagAliases.map((alias) => `\`${alias}\``).join(" ") : "None"
                )
                .addField("❯ Uses", tagDoc.tagUses)
                .addField("❯ Created At", moment(tagDoc.tagCreated).calendar());

            if (tagDoc.lastModifiedBy && tagDoc.lastModifiedAt) {
                const lastModifiedBy = await this.client.users.fetch(tagDoc.lastModifiedBy).catch(() => null);
                embed.addField(
                    "❯ Last Modified By",
                    lastModifiedBy ? `${lastModifiedBy.tag} (ID: ${lastModifiedBy.id})` : "Deleted User"
                );
                embed.addField("❯ Last Modified At", moment(tagDoc.lastModifiedAt).calendar());
            }

            message.channel.send(embed);
        }
    }

    async tagSearch(query, message) {
        if (!query) query = await this.awaitMessages(message, "What do you want to search for?");

        if (query) {
            const allTags = await this.getTag(message.guild, null, true);
            const resultTags = allTags.map((tag) => tag.tagName).filter((tag) => tag.includes(query));
            if (!resultTags.length) return message.channel.send("No results found.");

            const embed = new Embed().setColor("BLUE").setDescription(resultTags.map((tag) => `\`${tag}\``).join(" "));

            message.channel.send(embed);
        }
    }

    async listTags(user, message) {
        const mentionedUser = await this.client.util.getMentions().user(user);
        let allTags = await this.getTag(message.guild, null, true);
        if (mentionedUser) allTags = allTags.filter((tag) => tag.tagCreator === mentionedUser.id);
        else allTags = allTags.filter((tag) => tag.tagHoisted);
        if (!allTags.length)
            return message.channel.send(
                user ? "This member has't created any tags." : "This guild dosn't have any hoisted tags."
            );

        const embed = new Embed()
            .setColor("BLUE")
            .setTitle(mentionedUser ? `${mentionedUser.tag}'s tags` : `${message.guild.name}'s`)
            .setDescription(allTags.map((tag) => `\`${tag.tagName}\``).join(" "));

        message.channel.send(embed);
    }

    canModifyTag(member, tagMember) {
        const tagRestricted = member.guild.roles.cache.get(process.env.tagRestricted_role);
        if (tagRestricted && member.roles.cache.has(tagRestricted.id)) return true;
        if (member.id === tagMember || member.hasPermission("MANAGE_MESSAGES") || tagMember === null) return false;
        else return true;
    }

    getTagData(args, getHoisted = false) {
        const data = [];
        if (getHoisted) {
            if (hoistedRegex.test(args[0])) {
                const hoisted = hoistedRegex.exec(args[0])[0];
                data.push(hoisted === "--hoist" ? true : false);
                args.shift();
            } else {
                data.push(undefined);
            }
        }
        const tagString = args.join(" ");
        const tagExec = tagRegex.exec(tagString);

        if (!tagExec) {
            data.push(args[0]);
            data.push(args.slice(1).join(" "));
        } else if (tagExec[1] && tagExec[2]) {
            data.push(tagExec[1]);
            data.push(tagExec[2]);
        } else {
            data.push(tagExec[1]);
        }

        return data;
    }

    async getTag(guild, tagName, find = false) {
        if (find) {
            const tagDoc = await tagModel.find({ guildID: guild.id });
            return tagDoc;
        } else {
            const tagDoc =
                (await tagModel.findOne({ guildID: guild.id, tagName: tagName }).catch(console.error)) ||
                (await tagModel.findOne({ guildID: guild.id, tagAliases: tagName }).catch(console.error));
            return tagDoc;
        }
    }

    async awaitMessages(message, string) {
        let responce;

        const filter = (user) => {
            return user.author.id === message.author.id;
        };

        message.channel.send(`**${string}** \nType \`cancel\` to cancel the command.`);

        await message.channel
            .awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
            .then((msg) => {
                const firstMsg = msg.first();
                if (firstMsg.content.toLowerCase() === "cancel") return firstMsg.react("👍");
                responce = firstMsg.content;
            })
            .catch(() => {
                message.channel.send("Welp.. you took too long, cancelling the command.");
            });

        return responce;
    }

    async updateLastModified(member, tagDoc) {
        await tagDoc.updateOne({ lastModifiedAt: Date.now(), lastModifiedBy: member.id }).catch(console.error);
    }
};
