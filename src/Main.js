import {Box, Image, Text} from '@chakra-ui/react';

export default function Main ({description, source}) {


    function getType(source){
        const ext = source.split("?")[0].split('.').pop();
        if(['jpeg', 'jpg', 'gif','png', 'bmp'].indexOf(ext) >= 0) return 'IMAGE';
        if(['mov', 'mp4', 'mpeg', 'mpg', 'wmv', 'avi', 'ogg', 'webm', 'flv'].indexOf(ext) >= 0) return 'VIDEO';
        return;
    }

    getType(source);

    return (
        <Box>
            <Box m={3}>
                <Text>{description}</Text>
            </Box>
                {getType(source) === 'IMAGE' ?
                    <Image src={source} /> :
                getType(source) === 'VIDEO' ? (
                    <video controls width='100%'>
                        <source src={source} />
                    </video>
                ) : null}
        </Box>
    );
};
