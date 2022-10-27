import { Box, Tooltip } from '@chakra-ui/react';
import React from 'react';

export const AccoladeBadge = React.memo(function AccoladeBadge({
    title,
    description,
    imageUri,
}: {
    title: string;
    description: string;
    imageUri: string;
}) {
    {
        return (
            <Tooltip
                label={
                    <>
                        <p
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            {title}
                        </p>
                        <p>{description}</p>
                    </>
                }
            >
                <Box marginRight='4'>
                    <img
                        width='70'
                        height='70'
                        src={imageUri}
                        style={{ borderRadius: 8 }}
                    />
                </Box>
            </Tooltip>
        );
    }
});
