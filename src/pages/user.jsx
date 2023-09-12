import React, { Component, useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { withCookies, Cookies } from 'react-cookie';
import AvatarEditor from 'react-avatar-editor';

import Heading from '../components/heading';
import Spinner from '../components/spinner';

import { Context } from './_app';

import Wallpaper from '../scripts/wallpaper';

function Login({ query, bpApiLocation }) {
    const { state, setState } = useContext(Context.User);

    const [ userState, setUserState ] = useState({
        loading: true,
        exists: false,
        user: {
            game_id: query.id,
        },
        scoreboard: null
    });

    let avatarEditor;

    const [ modifications, setModifications ] = useState({
        avatar: null
    });

    let wallpaper = null;

    useEffect(() => {
        wallpaper = new Wallpaper();

        console.log(`user loading ${bpApiLocation}`, userState.user.game_id);

        fetch(bpApiLocation + `/user/${userState.user.game_id}`).then(r => r.json()).then(user => {
            setUserState({
                loading: false,
                exists: true,
                user
            })

            wallpaper.set({ url: user.avatar });
        }).catch(e => {
            setUserState({
                loading: false,
                exists: false,
                user: {
                    game_id: query.id,
                    username: `Not found`,
                },
            })
        })
    }, []);

    const importantMessage = (!userState.loading && userState.message);

    return (
        <div>
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
                                    }}
                                    ref={ref => avatarEditor = ref}
                                    image={modifications.avatar.file}
                                    width={250}
                                    height={250}
                                    border={10}
                                    borderRadius={10 * (250 / 100)}
                                    color={[255, 255, 255, 0.6]} // RGBA
                                    scale={modifications.avatar.scale}
                                    rotate={modifications.avatar.rotate}
                                />
                            } 
                            tags={[
                                {
                                    element: (
                                        <div style={{
                                            display: `flex`,
                                            flexDirection: `row`,
                                            alignItems: `center`,
                                            justifyContent: `center`,
                                        }}>
                                            <p style={{ marginRight: `8px` }}>Scale</p>
                                            <input style={{ width: `100px` }} type="range" min="1" max="100" value={(modifications.avatar.scale - 1)*25} onInput={e => {
                                                setModifications({
                                                    ...modifications, 
                                                    avatar: { 
                                                        ...modifications.avatar,
                                                        scale: (e.target.value/25) + 1
                                                    }
                                                })
                                            }} />
                                        </div>
                                    )
                                },
                                {
                                    element: (
                                        <div style={{
                                            display: `flex`,
                                            flexDirection: `row`,
                                            alignItems: `center`,
                                            justifyContent: `center`,
                                            margin: `0px 8px`
                                        }}>
                                            <p style={{ marginRight: `8px` }}>Rotate</p>
                                            <input style={{ width: `100px` }} type="range" min="-145" max="145" value={modifications.avatar.rotate} onInput={e => {
                                                setModifications({
                                                    ...modifications, 
                                                    avatar: { 
                                                        ...modifications.avatar,
                                                        rotate: e.target.value
                                                    }
                                                })
                                            }} />
                                        </div>
                                    )
                                },
                            ]} 
                            diffTags={[
                                {
                                    value: `Cancel`,
                                    key: `cancel`,
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
                        style={importantMessage && {
                            justifyContent: `center`,
                            alignItems: `center`,
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
                            state.user?.id === userState.user.game_id ? [
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

import getServerSideProps from '../util/getServerSideProps';
export { getServerSideProps }