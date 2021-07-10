module.exports = class Util {
    constructor(client) {
        this.client = client;
    }

    getMentions() {
        const client = this.client;

        return {
            member(mention, guild) {
                if (!mention) return;
                const matches = mention.match(/<@!?(\d{17,19})>/);
                const memberID = matches ? matches[1] : mention;
                return guild.members.cache.get(memberID);
            },
            async user(mention) {
                if (!mention) return;
                const matches = mention.match(/<@!?(\d{17,19})>/);
                const userID = matches ? matches[1] : mention;
                return await client.users.fetch(userID).catch(() => null);
            },
            channel(mention, guild) {
                if (!mention) return;
                const matches = mention.match(/<#(\d{17,19})>/);
                const channelID = matches ? matches[1] : mention;
                return guild.channels.cache.get(channelID);
            },
            role(mention, guild) {
                if (!mention) return;
                const matches = mention.match(/<@&(\d{17,19})>/);
                const roleID = matches ? matches[1] : mention;
                return guild.roles.cache.get(roleID);
            },
        };
    }

    capitalise(string) {
        return string
            .split(" ")
            .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
            .join(" ");
    }

    isNumeric(str) {
        if (typeof str != "string") return false;
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    }

    formatBytes(bytes) {
        if (bytes === 0) return "0 Bytes";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }
};
