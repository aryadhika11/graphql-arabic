const jsonwebtoken = require('jsonwebtoken')
const models = require('../models')
const { Op } = require("sequelize");
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const bcrypt = require('bcrypt');
const cloudinary = require("cloudinary");
require('dotenv').config({ path: '../.env' })

const resolvers = {
    Query: {
        async getProfile(root, args, { user }) {
            try {
                if (!user) throw new Error('You are not authenticated!');
                const userCheck = await models.user.findOne({
                    where: {
                        id: user.id
                    },
                    raw: true
                })

                let level = userCheck.exp / 1000
                level = Math.floor(level) + 1;

                const leaderboard = await models.user.findAll({
                    attributes: ['id', 'points'],
                    order: [
                        ['points', 'DESC']
                    ],
                    raw: true
                });

                let rank = 0
                leaderboard.forEach((item, index) => {
                    if (item.id === user.id) {
                        rank = index + 1;
                    }
                });

                return {
                    userCheck,
                    level,
                    rank
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },

        async getUserSavedLevel(root, { category, episode }, { user }) {
            try {
                if (!user) throw new Error('You are not authenticated!');
                const getUserSavedLevel = await models.savedlevel.findOne({
                    where: {
                        id: user.id,
                        category: category,
                        episode: episode
                    },
                });
                console.log(getUserSavedLevel)
                return getUserSavedLevel;
            } catch (error) {
                throw new Error(error.message)
            }
        },

        async getUserLevel(root, { category, episode }, { user }) {
            try {
                if (!user) throw new Error('You are not authenticated!');

                const levels = await models.level.findAll({
                    where: {
                        category: category,
                        episode: episode
                    },
                    raw: true
                });

                const savedlevels = await models.savedlevel.findAll({
                    where: {
                        id: user.id,
                        category: category,
                        episode: episode
                    },
                    raw: true
                });

                let arr = []
                for (let level of levels) {
                    let isCompleted = null
                    for (let savedlevel of savedlevels) {
                        if (level.category === savedlevel.category && level.episode === savedlevel.episode && level.level === savedlevel.level) {
                            isCompleted = savedlevel.isCompleted
                        }
                        const data = JSON.parse(JSON.stringify(level));
                        const obj = {
                            ...data,
                            isCompleted: isCompleted,
                        }
                        arr.push(obj)
                    }
                }
                return arr
            } catch (error) {
                throw new Error(error.message)
            }
        },

        async getProgress(root, { category, episode }, { user }) {
            try {
                if (!user) throw new Error('You are not authenticated!');

                const levels = await models.level.findAll({
                    where: {
                        category: category,
                        episode: episode
                    },
                    raw: true
                });

                const savedlevels = await models.savedlevel.findAll({
                    where: {
                        id: user.id,
                        category: category,
                        episode: episode
                    },
                    raw: true
                });

                let trueCount = 0;
                let falseCount = 0;
                let notStartedCount = 0;

                for (let savedlevel of savedlevels) {
                    if (savedlevel.isCompleted == true) {
                        trueCount++
                    } else if (savedlevel.isCompleted == false) {

                        falseCount++
                    }
                }

                notStartedCount = levels.length - savedlevels.length;

                return {
                    true: trueCount,
                    false: falseCount,
                    notStarted: notStartedCount
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },

        async getEpisode(root, { category }, { user }) {
            try {
                if (!user) throw new Error('You are not authenticated!');

                // Get Episode List
                let episodeIndex = 1;
                let arr = [];

                while (true) {
                    const levels = await models.level.findAll({
                        where: {
                            category: category,
                            episode: episodeIndex
                        },
                        raw: true

                    });
                    // console.log(levels)
                    if (!levels.length) {
                        break;
                    }
                    const savedLevels = await models.savedlevel.findAll({
                        where: {
                            id: user.id,
                            category: category,
                            episode: episodeIndex,
                            isCompleted: true
                        },
                        raw: true
                    });

                    const progress = (Math.floor((savedLevels.length / levels.length) * 100) / 100).toFixed(2);
                    const obj = {
                        episode: episodeIndex,
                        progress: progress,
                        level: levels.length,
                    }
                    arr.push(obj);
                    episodeIndex++;
                    console.log(obj)
                }
                return arr;
            } catch (error) {
                throw new Error(error.message)
            }
        },

        async getLeaderboard(root, args, { user }) {
            try {
                if (!user) throw new Error('You are not authenticated!');

                const leaderboard = await models.user.findAll({
                    attributes: ['id', 'name', 'exp', 'points', 'avatar'],
                    order: [
                        ['points', 'DESC']
                    ],
                    raw: true,
                    limit: 10
                })
                return leaderboard
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },
    Mutation: {
        //login
        async registerUser(root, { name, email, password }) {
            try {
                const userCheck = await models.user.findOne({
                    where: {
                        [Op.or]: [
                            { email: email }
                        ]
                    }
                })
                if (userCheck) {
                    throw new Error('Email or Employee id already exists')
                }
                const user = await models.user.create({
                    name,
                    email,
                    password,
                })

                const token = jsonwebtoken.sign({ id: user.id, email: user.email },
                    process.env.JWT_SECRET, { expiresIn: '1y' }
                )

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    date: user.date,
                    exp: user.exp,
                    points: user.points,
                    avatar: user.avatar
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },
        async login(_, { email, password }) {
            try {
                const user = await models.user.findOne({ where: { email } })

                if (!user) {
                    throw new Error('No user with that email')
                }
                const isValid = await models.user.validPassword(password, user.password)
                if (!isValid) {
                    throw new Error('Incorrect password')
                }

                // return jwt
                const token = jsonwebtoken.sign({ id: user.id, email: user.email },
                    process.env.JWT_SECRET, { expiresIn: '1d' }
                )

                return {
                    token,
                    user
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },
        async forgotPassword(_, { email, password }) {
            try {
                const userCheck = await models.user.findOne({
                    where: {
                        [Op.or]: [
                            { email: email }
                        ]
                    }
                })
                if (!userCheck) {
                    throw new Error('Email is not found')
                }

                const salt = await bcrypt.genSaltSync(10, 'a');
                const hashPassword = bcrypt.hashSync(password, salt);

                await models.user.update({
                    password: hashPassword
                }, {
                    where: {
                        email: email
                    }
                });

                const getNewPassword = await models.user.findOne({
                    where: {
                        [Op.or]: [
                            { email: email }
                        ]
                    }
                })
                return getNewPassword

            } catch (error) {
                throw new Error(error.message)
            }
        },
        async updateUser(_, { name, email, password, avatar }, { user }) {
            try {
                //check auth
                if (!user) throw new Error('You are not authenticated!');

                //hash password
                const salt = await bcrypt.genSaltSync(10, 'a');
                const hashPassword = bcrypt.hashSync(password, salt);

                //image upload
                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                });
                const result = await cloudinary.v2.uploader.upload(avatar, {
                    //here i chose to allow only jpg and png upload
                    allowed_formats: ["jpg", "png"],
                    //generates a new id for each uploaded image
                    public_id: "",
                    /*creates a folder called "your_folder_name" where images will be stored.
                     */
                    folder: "public",
                });

                //update to db
                await models.user.update({
                    name: name,
                    email: email,
                    password: hashPassword,
                    avatar: result.url
                }, {
                    where: {
                        id: user.id
                    }
                });

                const getNewUser = await models.user.findOne({
                    where: {
                        [Op.or]: [
                            { id: user.id }
                        ]
                    }
                })
                return getNewUser
            } catch (error) {
                throw new Error(error.message)

            }
        },

        //admin
        async uploadSoal(_, { category, episode, level, question, answer1, answer2, answer3, answer4, correctanswer }) {
            try {
                const soal = await models.level.create({
                    category,
                    episode,
                    level,
                    question,
                    answer1,
                    answer2,
                    answer3,
                    answer4,
                    correctanswer
                })
                let createdSoal = {
                    category: soal.category,
                    episode: soal.episode,
                    level: soal.level,
                    question: soal.question,
                    answer1: soal.answer1,
                    answer2: soal.answer2,
                    answer3: soal.answer3,
                    answer4: soal.answer4,
                    correctanswer: soal.correctanswer
                }
                return createdSoal
            } catch (error) {
                throw new Error(error.message)
            }
        },

        //savedUserProgress
        async savedUserProgress(_, { category, episode, level, isCompleted }, { user }) {
            try {
                //check auth
                if (!user) throw new Error('You are not authenticated!');

                const Completed = await models.savedlevel.findOne({
                    where: {
                        id: user.id
                    }
                });
                // console.log(Completed.toJSON());

                //updated level
                if (Completed) {
                    await models.savedlevel.update({
                        category: category,
                        episode: episode,
                        level: level,
                        isCompleted: isCompleted
                    }, {
                        where: {
                            id: user.id
                        }
                    });
                    const getSavedLevelUpdated = await models.savedlevel.findOne({
                        where: {
                            [Op.or]: [
                                { id: user.id }
                            ]
                        }
                    })
                    return getSavedLevelUpdated
                }

                //newLevelUser
                const savedLevel = await models.savedlevel.create({
                    id: user.id,
                    category: category,
                    episode: episode,
                    level: level,
                    isCompleted: isCompleted
                })
                if (savedLevel) {
                    await models.user.update({
                        exp: 100,
                        points: 100
                    }, {
                        where: {
                            id: user.id
                        }
                    });
                    // const users = await models.user.findOne({
                    //     where: {
                    //         [Op.or]: [{
                    //             id: user.id,
                    //         }]
                    //     }
                    // })
                    // users.exp += 100
                    // users.points += 100
                }
                const getSavedLevel = await models.savedlevel.findOne({
                    where: {
                        [Op.or]: [
                            { id: user.id }
                        ]
                    }
                })
                return getSavedLevel
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        },
    })
}

module.exports = resolvers