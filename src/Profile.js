import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import AppContext from './AppContext';
import { DataStore } from '@aws-amplify/datastore';
import Storage from "@aws-amplify/storage";
import { Box, Flex, Container, Heading, Image, Spacer, Text } from '@chakra-ui/react';
import { User } from './models';

export default function Profile() {
    const user = useContext(AppContext);

    const [image, setImage] = useState('https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png');
    let fileInput = useRef();

    const onOpenFileDialog = () => {
        fileInput.current.click();
    };

    const onProcessFile = e => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];
        try {
            reader.readAsDataURL(file);
        } catch (err) {
            console.log(err);
        }
        reader.onloadend = () => {
            setImage(reader.result);
        };
        Storage.put(`${user.username}-avatar.png`, file, {
            contentType: "image/png"
        })
            .then(async result => {
                const original = await DataStore.query(User, user.username);
                const urlPic = `http://d2m7yuqj2jn2cq.cloudfront.net/${user.username}-avatar.png`; // await Storage.get(result.key);
                // console.log(original, result, urlPic)
                await DataStore.save(
                User.copyOf(original, updated => {
                    updated.profilePic = urlPic;
                })
                )
            })
            .catch(err => console.log(err));
    };

    const getAvatar = useCallback(async () => {
        const userData = await DataStore.query(User, user.username);
        // console.log(userData);
        userData?.profilePic?.length && setImage(userData.profilePic);
    }, [user.username]);

    useEffect(() => {
        getAvatar();
    }, [getAvatar]);

    return (
        <Container>
            <Box
                maxW='lg'
                overflow='hidden'
                mx={2} my={5}
            >
                <Heading mb={5}>Profile</Heading>
                <Flex alignItems='center' mb={5}>
                    <input
                        type="file"
                        onChange={onProcessFile}
                        ref={fileInput}
                        hidden={true}
                    />
                    <Image boxSize="100px" alt='file' src={image} onClick={onOpenFileDialog} />

                    <Text ml={3}>
                        <Text as='b'>Username: </Text>{user.attributes.name}
                    </Text>
                </Flex>
                <Spacer />
                <Text fontWeight='bold' fontSize='sm'>
                    Check your details:
                </Text>
                <pre>
                    <Text fontSize="xs">
                        {JSON.stringify(user, null, 2)}
                    </Text>
                </pre>
            </Box>
        </Container>
    );
}