import React, { Component, useState, useEffect, useContext } from 'react';
import MarkdownView from 'react-showdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { withCookies, Cookies } from 'react-cookie';
import AvatarEditor from 'react-avatar-editor';

import Heading from '../components/heading';
import Spinner from '../components/spinner';
import Leaderboard from '../components/leaderboard';
import SEO from '../components/SEO';

import { Context } from '../util/context';

import Wallpaper from '../scripts/wallpaper';
import { recentScores, recentBeatSaverLookup } from '../scripts/leaderboard/recent';

import userOverrides from '../styles/overrides/user'

import staticVars from '../../static.json';

const userDetails = (userState) => {
    console.log(`userDetails`, userState);

    const exists = {
        username: userState.user.username ? true : false,
        description: userState.user.description && userState.user.description != `null` ? true : false,
    };

    if(!userState.exists) {
        for(const key in Object.keys(exists)) {
            exists[key] = false;
        }
    };

    const rawValues = {
        username: exists.username ? userState.user.username : null,
        description: exists.description && exists.description != `null` ? userState.user.description : null,
    };

    const values = {
        username: rawValues.username,
        description: (
            rawValues.description || (
                <div style={{
                    display: `flex`,
                    flexDirection: `row`,
                    alignItems: `center`,
                }}>
                    <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `4px`, width: `14px`, height: `14px`}} />
                    <i>This user hasn't set a description yet.</i>
                </div>
            )
        ),
    };

    return { exists, rawValues, values }
}

function Login({ query, userData }) {
    const [ userState, setUserState ] = useState(userData);
    const { user, setUser } = useContext(Context.User);

    let avatarEditor;

    const initialMods = {
        avatar: null,
        user: null,
    }

    const [ state, setState ] = useState({
        wallpaper: null,
    });

    const defaultRecent = {
        entries: [],
        total: null,
        page: 1,
        totalPages: 0,
        loading: false,
        error: false,
    }

    const [ recent, setRecent ] = useState(defaultRecent);

    const [ modifications, setModifications ] = useState(initialMods);

    const styleOverrides = userOverrides[userData.user?.gameID] || {};

    const mapScores = data => data.slice().map(o => {
        o.username = o.map?.metadata?.songName || o.name;
        o.name = null;
        o.map = null;
        o.id = null;
        o.avatar = o.thumbnail;
        o.link = o.hash && `/leaderboard/${o.hash}` || null;

        return o;
    });

    const getScores = (page = recent.page) => {
        console.log(`fetching scores @ page ${page}`);

        setRecent(defaultRecent);

        recentScores({
            id: userData.user.gameID,
            offset: page-1,
        }).then((data) => {
            if(Array.isArray(data.scores) && data.scores.length) data.scores = data.scores.map(o => Object.assign({}, o, o.hash ? {
                thumbnail: `https://cdn.beatsaver.com/${o.hash.toLowerCase()}.jpg`,
            } : {}));

            console.log(`scores`, data.scores);

            const newRecent = {
                ...recent,
                page: page,
                entries: mapScores(data.scores),
                total: data.scoreCount,
                totalPages: Math.max(1, data.scoreCount && Math.ceil(data.scoreCount / 10) || 1),
                loading: false,
                error: null
            };

            setRecent(newRecent);

            console.log(`getting beatsaver data`, newRecent)

            recentBeatSaverLookup(data.scores).then((updated) => {
                setRecent({
                    ...newRecent,
                    entries: mapScores(updated),
                });
            });
        }).catch((err) => {
            console.log(`error at user page`, err);
            setRecent({
                entries: [],
                page: page,
                totalPages: 0,
                loading: false,
                error: err,
            })
        });
    }

    useEffect(() => {
        const newState = {
            ...state,
            wallpaper: new Wallpaper(),
        };

        setState(newState)

        console.log(`user loading ${staticVars.locations.api}`, userData.user.gameID);

        if(userData.exists) {
            if(styleOverrides.rain) styleOverrides.rain(`.tg`)
    
            newState.wallpaper.set({ url: userData.user.avatar });

            if(!recent.loading && !recent.entries.length) getScores();
        }
    }, []);

    const importantMessage = (!userState.loading && userState.message);

    return (
        <div>
            <SEO
                title={styleOverrides.embed?.title || `${userData.user?.username || `Unknown Player`} - Bloq Party Leaderboard`}
                description={styleOverrides.embed?.description || userData.user?.description || `View the scores of ${userData.user?.username || `Unknown Player`} on the Bloq Party Leaderboard.`}
                image={styleOverrides.embed?.image || userData.user?.avatar}
                color={styleOverrides.embed?.color}
                url={`${staticVars.locations.website}/user/${userData.user?.gameID}`}
            />

            {
                modifications.avatar?.file ? (
                    <div style={{
                        display: `flex`,
                        alignItems: `center`,
                        justifyContent: `center`,
                    }}>
                        <Heading 
                            loading={modifications.avatar.saving}
                            reverseLoadingAnimate={true}
                            style={{
                                justifyContent: `center`,
                                alignItems: `center`,
                                textAlign: `center`,
                                position: `relative`,
                            }}
                            title={modifications.avatar.error || `Edit Avatar`}
                            description={
                                <AvatarEditor
                                    style={{
                                        position: `relative`,
                                        marginTop: `20px`,
                                        borderRadius: `${10 * (250 / 100)}px`,
                                        backgroundColor: `rgb(50, 50, 50)`,
                                        boxShadow: `0 0px 20px rgb(50, 50, 50)`,
                                    }}
                                    backgroundColor='rgb(50, 50, 50)'
                                    ref={ref => avatarEditor = ref}
                                    image={modifications.avatar.file}
                                    width={250}
                                    height={250}
                                    border={0}
                                    color={[255, 255, 255, 0.6]} // RGBA
                                    scale={((modifications.avatar.scale-1)/50)+1}
                                    rotate={modifications.avatar.rotate}
                                />
                            } 
                            tags={[
                                {
                                    value: `Reset`,
                                    icon: icon({ name: 'undo' }),
                                    key: `reset`,
                                    onClick: () => {
                                        console.log(`reset`);
                                        setModifications({
                                            ...modifications,
                                            avatar: {
                                                ...modifications.avatar,
                                                scale: 1,
                                                rotate: 0,
                                            }
                                        });
                                    }
                                },
                                {
                                    key: `scale`,
                                    icon: icon({ name: 'expand' }),
                                    value: (
                                        <div style={{
                                            display: `flex`,
                                            flexDirection: `row`,
                                            alignItems: `center`,
                                            justifyContent: `center`,
                                        }}>
                                            <p style={{ marginRight: `8px` }}>Scale</p>
                                            <input style={{ width: `80px` }} type="range" min="1" max="100" value={modifications.avatar.scale} onInput={e => {
                                                setModifications({
                                                    ...modifications, 
                                                    avatar: { 
                                                        ...modifications.avatar,
                                                        scale: e.target.value
                                                    }
                                                })
                                            }} />
                                        </div>
                                    ),
                                },
                                {
                                    key: `rotate`,
                                    icon: icon({ name: 'redo' }),
                                    value: (
                                        <div style={{
                                            display: `flex`,
                                            flexDirection: `row`,
                                            alignItems: `center`,
                                            justifyContent: `center`,
                                        }}>
                                            <p style={{ marginRight: `8px` }}>Rotate</p>
                                            <input style={{ width: `80px` }} type="range" min="-180" max="180" value={modifications.avatar.rotate} onInput={e => {
                                                setModifications({
                                                    ...modifications, 
                                                    avatar: { 
                                                        ...modifications.avatar,
                                                        rotate: e.target.value
                                                    }
                                                })
                                            }} />
                                        </div>
                                    ),
                                },
                            ]} 
                            buttons={[
                                {
                                    value: `Cancel`,
                                    key: `cancel`,
                                    icon: icon({ name: 'times' }),
                                    color: "#db515f",
                                    onClick: () => {
                                        console.log(`cancel`);
                                        setModifications({
                                            ...modifications,
                                            avatar: null
                                        });
                                    }
                                },
                                {
                                    value: `Save`,
                                    key: `save`,
                                    icon: icon({ name: 'floppy-disk' }),
                                    color: "linear-gradient(135deg, rgb(112,143,255) 0%, rgb(198,128,237) 100%)",
                                    onClick: () => {
                                        setModifications({
                                            ...modifications,
                                            avatar: {
                                                ...modifications.avatar,
                                                error: null
                                            }
                                        });

                                        console.log(`save`);

                                        // get canvas

                                        const canvas = avatarEditor;

                                        if(canvas) {
                                            setModifications({
                                                ...modifications,
                                                avatar: {
                                                    ...modifications.avatar,
                                                    error: null,
                                                    saving: true
                                                }
                                            });

                                            // scale canvas down to 185px by 185px
                                            const scaledCanvas = document.createElement(`canvas`);
                                            scaledCanvas.width = 185;
                                            scaledCanvas.height = 185;
                                            scaledCanvas.getContext(`2d`).drawImage(canvas.getImage(), 0, 0, 185, 185);

                                            // convert canvas to png with base64 encoding
                                            const data = scaledCanvas.toDataURL(`image/png`, 1).split(';base64,')[1];

                                            // add to user object

                                            setModifications({
                                                ...modifications,
                                                user: {
                                                    ...modifications.user,
                                                    avatar: data
                                                },
                                                avatar: null
                                            });
                                        } else {
                                            console.log(`canvas not found`);
                                            setModifications({
                                                ...modifications,
                                                avatar: {
                                                    ...modifications.avatar,
                                                    error: `canvas wasn't found; this isn't supposed to happen`
                                                }
                                            });
                                        }
                                    }
                                },
                            ]}
                        />
                    </div>
                ) : modifications.user ? (
                    <Heading 
                        loading={modifications.user.saving}
                        reverseLoadingAnimate={true}
                        image={modifications.user.avatar ? `data:image/png;base64,${modifications.user.avatar}` : userState.user.avatar}
                        imageStyle={{
                            width: `150px`,
                            height: `150px`,
                            ...(modifications.user.avatar && {
                                padding: `4px`,
                                borderStyle: `dashed`,
                                borderColor: `rgba(255, 255, 255, 0.5)`,
                            } || {})
                        }}
                        title={modifications.user.error || `Edit Profile`}
                        description={(
                            <div style={{
                                display: `flex`,
                                width: `100%`,
                                flexDirection: `column`,
                                alignItems: `start`,
                                justifyContent: `center`,
                            }}>
                                <p style={{ marginBottom: `2px` }}>Username</p>
                                <input type='text' value={modifications.user.username}  style={{
                                    width: `100%`,
                                }} onChange={e => {
                                    setModifications({
                                        ...modifications,
                                        user: {
                                            ...modifications.user,
                                            username: e.target.value,
                                        }
                                    });
                                }} />

                                <p style={{ marginTop: `8px`, marginBottom: `2px` }}>Bio</p>
                                <textarea name='description' cols="40" rows="5" style={{
                                    resize: `vertical`,
                                    width: `100%`,
                                }} value={modifications.user.description} onChange={e => {
                                    setModifications({
                                        ...modifications,
                                        user: {
                                            ...modifications.user,
                                            description: e.target.value,
                                        }
                                    });
                                }} />
                            </div>
                        )}
                        buttons={[
                            {
                                value: `Set new Avatar`,
                                key: `set-avatar`,
                                icon: icon({ name: 'upload' }),
                                onClick: () => {
                                    console.log(`set avatar`);

                                    const input = document.createElement(`input`);
                                    input.type = `file`;
                                    input.accept = `image/*`;
        
                                    input.addEventListener(`change`, () => {
                                        const file = input.files[0];
                                        const reader = new FileReader();
        
                                        reader.addEventListener(`load`, () => {
                                            setModifications({
                                                ...modifications,
                                                avatar: {
                                                    scale: 1,
                                                    rotate: 0,
                                                    file: reader.result,
                                                }
                                            });
                                        });
        
                                        reader.readAsDataURL(file);
                                    });
        
                                    input.click();
                                }
                            },
                        ]}
                        tags={[
                            {
                                value: `Save`,
                                key: `save-user-details`,
                                icon: icon({ name: 'floppy-disk' }),
                                onClick: () => {
                                    setModifications({
                                        ...modifications,
                                        user: {
                                            ...modifications.user,
                                            saving: true
                                        }
                                    });

                                    if(modifications.user.avatar) state.wallpaper.hide();
                                    
                                    // upload to server
                                    fetch(`/internal/updateUser`, {
                                        method: `POST`,
                                        headers: {
                                            'Content-Type': `application/json`
                                        },
                                        body: JSON.stringify(modifications.user)
                                    }).then(async res => {
                                        try {
                                            const json = await res.json();

                                            if(json.error) {
                                                console.log(`error: ${json.error}`);
                                                setModifications({
                                                    ...modifications,
                                                    user: {
                                                        ...modifications.user,
                                                        saving: false,
                                                        error: `${json.error}`
                                                    }
                                                });
                                            } else {
                                                console.log(`no error`);

                                                if(modifications.user.avatar) {
                                                    userState.user.avatar = userState.user.avatar.split(`?`)[0] + `?${Date.now()}`;

                                                    if(state.wallpaper) {
                                                        console.log(`setting wallpaper`);
                                                        state.wallpaper.set({ url: userState.user.avatar });
                                                    } else console.log(`wallpaper not found`);
                                                }

                                                const u = user.user;

                                                const newUser = {
                                                    ...user,
                                                    user: {
                                                        ...u,
                                                        ...(modifications.user.avatar && {
                                                            avatarURL: userState.user.avatar
                                                        } || {}),
                                                        username: modifications.user.username || u.username,
                                                        description: modifications.user.description || u.description,
                                                    }
                                                };

                                                console.log(`new user`, newUser);

                                                setModifications(initialMods);
                                                setUser(newUser);
                                                setUserState({
                                                    ...userState,
                                                    user: {
                                                        ...userState.user,
                                                        ...(modifications.user.avatar && {
                                                            avatar: userState.user.avatar
                                                        } || {}),
                                                        username: modifications.user.username || userState.user.username,
                                                        description: modifications.user.description || userState.user.description,
                                                    }
                                                });
                                            };

                                            return;
                                        } catch(e) {
                                            console.log(`avatar not updated`);
                                            console.log(`error: ${e}`);
                                            if(modifications.user.avatar) state.wallpaper.set({ url: userState.user.avatar });
                                            setModifications({
                                                ...modifications,
                                                avatar: {
                                                    ...modifications.avatar,
                                                    saving: false,
                                                    error: `${e}`
                                                }
                                            });
                                        };
                                    }).catch(e => {
                                        console.log(`avatar not updated`);
                                        console.log(`error: ${e}`);
                                        setModifications({
                                            ...modifications,
                                            avatar: {
                                                ...modifications.avatar,
                                                error: `${e}`
                                            }
                                        });
                                    })
                                }
                            },
                            {
                                value: `Cancel`,
                                key: `cancel-user-details`,
                                icon: icon({ name: 'x' }),
                                onClick: () => {
                                    setModifications(initialMods);
                                }
                            },
                        ]}
                    />
                ) : (
                    <Heading 
                        loading={userState.loading}
                        image={userState.user.avatar}
                        style={{
                            ...(styleOverrides && styleOverrides.heading),
                            ...(importantMessage && {
                                justifyContent: `center`,
                                alignItems: `center`,
                            })
                        }}
                        title={
                            importantMessage || userDetails(userState).values.username ? 
                                importantMessage || userDetails(userState).values.username : 
                            <>
                                <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                                <span>Something went wrong.</span>
                            </>
                        }
                        description={
                            importantMessage ? null : (
                                <div style={{
                                    display: `flex`,
                                    flexDirection: `column`,
                                    alignItems: `start`,
                                    justifyContent: `center`,
                                    width: `100%`,
                                    fontWeight: 'revert',
                                    fontSize: 'revert',
                                    fontStyle: 'revert',
                                }}>
                                    {
                                        userDetails(userState).rawValues.description && (
                                            <MarkdownView
                                                markdown={ userDetails(userState).rawValues.description }
                                                options={{
                                                    simplifiedAutoLink: true,
                                                    emoji: true,
                                                    strikethrough: true,
                                                    headerLevelStart: 2
                                                }}
                                            />
                                        ) || userDetails(userState).values.description
                                    }
                                </div>
                            )
                        }
                        buttons={
                            importantMessage ? [] : 
                            userState.exists && user.user?.id === userState.user.gameID ? [
                                {
                                    value: `Edit Profile`,
                                    key: `edit-profile`,
                                    icon: icon({ name: 'pencil' }),
                                    onClick: () => {
                                        const values = userDetails(userState).rawValues;

                                        for(const key in values) values[key] = values[key] || ``;
                                        
                                        setModifications({
                                            ...initialMods,
                                            user: values,
                                        });
                                    }
                                },
                            ] : null
                        }
                    />
                )
            }

            <Leaderboard
                loading={recent.loading} 
                error={recent.error}
                entries={recent.entries}
                total={recent.total}
                page={{
                    current: recent.page,
                    total: recent.totalPages,
                    set: (nonexistenthashlol, num) => getScores(num)
                }} 
            />
        </div>
    )
}

export default withCookies(Login);

export async function getServerSideProps(req) {
    const props = Object.assign({}, req.query, { query: req.query });

    console.log(`props`, props);

    try {
        const u = await fetch(staticVars.locations.api + `/user/${props.query.id}`).then(r => r.json());

        console.log(`user`, u);

        if(u.avatar) {
            u.avatar = staticVars.locations.api + `/user` + u.avatar.split(`/user`).slice(1).join(`/user`);
            console.log(`avatar`, u.avatar);
        }

        return {
            props: {
                ...props,
                userData: {
                    loading: false,
                    exists: true,
                    user: u,
                }
            }
        }
    } catch(e) {
        return {
            props: {
                ...props,
                userData: {
                    loading: false,
                    exists: false,
                    user: {
                        gameID: props.query.id,
                        username: `Not found`,
                    },
                }
            }
        }
    }
}