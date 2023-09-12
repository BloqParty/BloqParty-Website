import React, { Component, useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { withCookies, Cookies } from 'react-cookie';
import AvatarEditor from 'react-avatar-editor';

import Heading from '../components/heading';
import Spinner from '../components/spinner';

import { Context } from '../util/context';

import Wallpaper from '../scripts/wallpaper';

import userOverrides from '../styles/overrides/user'

function Login({ query, bpApiLocation, userState }) {
    const { user } = useContext(Context.User);

    let avatarEditor;

    const [ modifications, setModifications ] = useState({
        avatar: null
    });

    let wallpaper = null;

    const styleOverrides = userOverrides[userState.user?.game_id] || {};

    useEffect(() => {
        wallpaper = new Wallpaper();

        console.log(`user loading ${bpApiLocation}`, userState.user.game_id);

        if(userState.exists) {
            if(styleOverrides.rain) styleOverrides.rain(`.tg`)
    
            wallpaper.set({ url: userState.user.avatar });
        }
    }, []);

    const importantMessage = (!userState.loading && userState.message);

    return (
        <div>
            <SEO
                title={styleOverrides.embed?.title || `${userState.user?.username || `Unknown Player`} - Bedroom Party Leaderboard`}
                description={styleOverrides.embed?.description}
                image={styleOverrides.embed?.image || userState.user?.avatar}
                color={styleOverrides.embed?.color}
                url={`https://thebedroom.party/user/${userState.user?.game_id}`}
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
                            diffTags={[
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
                                    icon: icon({ name: 'check' }),
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

                                            // scale canvas down to 150px by 150px
                                            const scaledCanvas = document.createElement(`canvas`);
                                            scaledCanvas.width = 150;
                                            scaledCanvas.height = 150;
                                            scaledCanvas.getContext(`2d`).drawImage(canvas.getImageScaledToCanvas(), 0, 0, 150, 150);

                                            // convert canvas to png with base64 encoding
                                            const data = scaledCanvas.toDataURL(`image/png`, 1).split(';base64,')[1];

                                            // upload to server
                                            fetch(`/internal/avatar/upload`, {
                                                method: `POST`,
                                                headers: {
                                                    'Content-Type': `application/json`
                                                },
                                                body: JSON.stringify({
                                                    avatar: data
                                                })
                                            }).then(async res => {
                                                try {
                                                    const json = await res.json();

                                                    if(json.error) {
                                                        console.log(`error: ${json.error}`);
                                                        setModifications({
                                                            ...modifications,
                                                            avatar: {
                                                                ...modifications.avatar,
                                                                error: `${json.error}`
                                                            }
                                                        });
                                                    } else {
                                                        console.log(`no error`);
                                                        setModifications({
                                                            ...modifications,
                                                            avatar: null
                                                        });
                                                    };

                                                    return;
                                                } catch(e) {
                                                    console.error(e);
                                                }

                                                if(res.status == 200) {
                                                    console.log(`avatar updated`);
                                                    setModifications({
                                                        ...modifications,
                                                        avatar: null
                                                    });
                                                } else {
                                                    console.log(`avatar not updated`);
                                                }
                                            }).catch(e => {
                                                console.log(`avatar not updated`);
                                            })
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
                            importantMessage || userState.user.username ? 
                                importantMessage || userState.user.username : 
                            <>
                                <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                                <span>Something went wrong.</span>
                            </>
                        }
                        description={
                            importantMessage ? null :
                            userState.exists ? 
                                "plays beat saber or something" : 
                            userState.error ? `Error: ${userState.error}` : null
                        } 
                        tags={
                            importantMessage ? [] :
                            userState.exists ? [

                            ] : []
                        } 
                        diffTags={
                            user.user?.id === userState.user.game_id ? [
                                {
                                    value: `Set new Avatar`,
                                    key: `set-avatar`,
                                    icon: icon({ name: 'user' }),
                                    onClick: () => {
                                        console.log(`set avatar`);

                                        const input = document.createElement(`input`);
                                        input.type = `file`;
                                        input.accept = `image/png`;
            
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
                                {
                                    value: `Edit Profile`,
                                    key: `edit-profile`,
                                    icon: icon({ name: 'pencil' }),
                                    onClick: () => {
                                        console.log(`edit profile`);
                                    }
                                },
                            ] : null
                        }
                    />
                )
            }
        </div>
    )
}

export default withCookies(Login);

import getProps from '../util/getServerSideProps';
import SEO from '../components/SEO';

export async function getServerSideProps(o) {
    const { props } = getProps(o);

    try {
        const u = await fetch(props.bpApiLocation + `/user/${props.query.id}`).then(r => r.json());

        console.log(`user`, u);

        return {
            props: {
                ...props,
                userState: {
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
                userState: {
                    loading: false,
                    exists: false,
                    user: {
                        game_id: props.query.id,
                        username: `Not found`,
                    },
                }
            }
        }
    }
}