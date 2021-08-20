/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-const */
const Embed = require("../../structures/embed");
const Command = require("../../structures/bases/commandBase");
const { incorrect, error, redEmbed } = require("../../utils/export/index");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "blackjack",
            description:
                "Take your chances and test your skills at blackjack. Warning, I am very good at stealing your money",
            category: "Economy",
            cooldown: 5,
            botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
            memberPermission: ["SEND_MESSAGES"],
            usage: "<Amoint>",
            aliases: ["bj"],
            ownerOnly: false,
            nsfw: false,
            bankspace: 5,
        });
    }

    async execute(message, args) {
        const userData = await this.client.util.fetchUser(message.author.id);
        let betAmount = 0;

        if (args[0] === "all" || args[0] === "max") {
            betAmount = userData.coinsInWallet;
        } else {
            betAmount = parseInt(args[0]);
        }

        if (!betAmount || betAmount < 1 || betAmount > userData) {
            return incorrect("You need to add an amount", message.channel).catch();
        }

        if (!userData) {
            return error("You don't have that many coins.", message.channel).catch();
        }
        if (betAmount > userData.coinsInWallet) {
            return error("You dont have that many coins.", message.channel);
        }
        if (betAmount < 150) {
            return error("The minimum you can gamble is `150` coins.", message.channel);
        }

        // ** BEGIN Javascript blackjack game from echohatch1. Modified for Grape.

        let numCardsPulled = 0;
        let gameOver = false;

        const player = {
            cards: [],
            score: 0,
        };
        const dealer = {
            cards: [],
            score: 0,
        };

        function getCardsValue(a) {
            let cardArray = [],
                sum = 0,
                i = 0,
                dk = 10.5,
                doubleking = "QQ",
                aceCount = 0;
            cardArray = a;
            for (i; i < cardArray.length; i += 1) {
                if (cardArray[i].rank === "J" || cardArray[i].rank === "Q" || cardArray[i].rank === "K") {
                    sum += 10;
                } else if (cardArray[i].rank === "A") {
                    sum += 11;
                    aceCount += 1;
                } else if (cardArray[i].rank === doubleking) {
                    sum += dk;
                } else {
                    sum += cardArray[i].rank;
                }
            }
            while (aceCount > 0 && sum > 21) {
                sum -= 10;
                aceCount -= 1;
            }
            return sum;
        }

        const deck = {
            deckArray: [],
            initialize: function () {
                let suitArray, rankArray, s, r, n;
                suitArray = ["clubs", "diamonds", "hearts", "spades"];
                rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
                n = 13;
                for (s = 0; s < suitArray.length; s += 1) {
                    for (r = 0; r < rankArray.length; r += 1) {
                        this.deckArray[s * n + r] = {
                            rank: rankArray[r],
                            suit: suitArray[s],
                        };
                    }
                }
            },
            shuffle: function () {
                let temp, i, rnd;
                for (i = 0; i < this.deckArray.length; i += 1) {
                    rnd = Math.floor(Math.random() * this.deckArray.length);
                    temp = this.deckArray[i];
                    this.deckArray[i] = this.deckArray[rnd];
                    this.deckArray[rnd] = temp;
                }
            },
        };

        deck.initialize();
        deck.shuffle();

        async function bet(outcome) {
            if (outcome === "win") {
                const wonCoins = parseInt(betAmount + betAmount * 0.15);
                userData.coinsInWallet += parseInt(wonCoins);
                await userData.save();
            }
            if (outcome === "lose") {
                userData.coinsInWallet -= parseInt(betAmount);
                await userData.save();
            }
        }

        function endMsg(title, msg, dealerC) {
            let cardsMsg = "";
            player.cards.forEach(function (card) {
                cardsMsg += "[`" + card.rank.toString();
                if (card.suit == "hearts") cardsMsg += "♥";
                if (card.suit == "diamonds") cardsMsg += "♦";
                if (card.suit == "spades") cardsMsg += "♠";
                if (card.suit == "clubs") cardsMsg += "♣";
                cardsMsg += "`]() ";
            });
            cardsMsg += "\n**Total** : " + player.score.toString();

            let dealerMsg = "";
            if (!dealerC) {
                dealerMsg = "[`" + dealer.cards[0].rank.toString();
                if (dealer.cards[0].suit == "hearts") dealerMsg += "♥";
                if (dealer.cards[0].suit == "diamonds") dealerMsg += "♦";
                if (dealer.cards[0].suit == "spades") dealerMsg += "♠";
                if (dealer.cards[0].suit == "clubs") dealerMsg += "♣";
                dealerMsg += " ? ?`]()";
            } else {
                dealerMsg = "";
                dealer.cards.forEach(function (card) {
                    dealerMsg += "[`" + card.rank.toString();
                    if (card.suit == "hearts") dealerMsg += "♥";
                    if (card.suit == "diamonds") dealerMsg += "♦";
                    if (card.suit == "spades") dealerMsg += "♠";
                    if (card.suit == "clubs") dealerMsg += "♣";
                    dealerMsg += "`]() ";
                });
                dealerMsg += "\n**Total** : " + dealer.score.toString();
            }

            const gambleEmbed = new Embed()
                .setColor("RANDOM")
                .setTitle(message.author.username + "'s Blackjack Game")
                .addField("Your Cards", cardsMsg)
                .addField("Dealer's Cards", dealerMsg)
                .addField(title, msg);

            message.channel.send(gambleEmbed);
        }

        async function endGame() {
            if (player.score === 21) {
                bet("win");
                gameOver = true;
                await endMsg("You win", "You got 21! You win!", true);
            }
            if (player.score > 21) {
                bet("lose");
                gameOver = true;
                await endMsg("You have lost", "You got over 21 `bust` ", true);
            }
            if (dealer.score === 21) {
                bet("lose");
                gameOver = true;
                await endMsg("You lost", "dealer got 21 ", true);
            }
            if (dealer.score > 21) {
                bet("win");
                gameOver = true;
                await endMsg("You won !", "Dealer busted. You win", true);
            }
            if (dealer.score >= 17 && player.score > dealer.score && player.score < 21) {
                bet("win");
                gameOver = true;
                await endMsg(
                    "You won !",
                    "Dealer stoped on 17 or above and still didnt get a higer total than you. You win",
                    true
                );
            }
            if (dealer.score >= 17 && player.score < dealer.score && dealer.score < 21) {
                bet("lose");
                gameOver = true;
                await endMsg("You lost", "Dealer has won.", true);
            }
            if (dealer.score >= 17 && player.score === dealer.score && dealer.score < 21) {
                gameOver = true;
                await endMsg("Dealer and Player cards total the same", "draw ", true);
            }
        }

        function dealerDraw() {
            dealer.cards.push(deck.deckArray[numCardsPulled]);
            dealer.score = getCardsValue(dealer.cards);
            numCardsPulled += 1;
        }

        function newGame() {
            hit();
            hit();
            dealerDraw();
            endGame();
        }

        function hit() {
            player.cards.push(deck.deckArray[numCardsPulled]); // END Javascript blackjack game from echohatch1. Modified by Brandon-The-Dev for Hydra+
            player.score = getCardsValue(player.cards);

            numCardsPulled += 1;
            if (numCardsPulled > 2) {
                endGame();
            }
        }

        function stand() {
            while (dealer.score < 17) {
                dealerDraw();
            }
            endGame();
        }

        newGame();
        async function loop() {
            if (gameOver) return;

            endMsg("Info", "Hit = [`h`]()  |  Stand = [`s`]()  \nOr [`cancel`]() but you will lose your bet ? ", false);

            const filter = (m) => m.author.id === message.author.id;
            message.channel
                .awaitMessages(filter, {
                    max: 1,
                    time: 25000,
                    errors: ["time"],
                })
                .then((message) => {
                    message = message.first();
                    if (
                        message.content === "h" ||
                        message.content.includes("H") ||
                        message.content.includes("Hit") ||
                        message.content.includes("hit")
                    ) {
                        // if (colour == "b" || colour.includes("black")) colour = 0;
                        hit();
                        loop();
                        return;
                    } else if (
                        message.content === "s" ||
                        message.content.includes("S") ||
                        message.content.includes("Stand") ||
                        message.content.includes("stand")
                    ) {
                        stand();
                        loop();
                        return;
                    } else {
                        return redEmbed(
                            `You canceled the game, now you have lost your bet of **${betAmount.toLocaleString()}** coins`,
                            message.channel
                        ).catch();
                    }
                })
                .catch(() => {
                    return redEmbed(
                        `You took to long to pick, now you have lost your bet of **${betAmount.toLocaleString()}** coins`,
                        message.channel
                    ).catch();
                });
        }

        await loop();
    }
};
