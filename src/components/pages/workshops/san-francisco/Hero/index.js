import React from 'react'

import { Box, ResponsiveStack } from 'serverless-design-system'
import {
  HeroWrapperNew as HeroWrapper,
} from 'src/fragments'
import { P, Button } from 'src/fragments/DesignSystem'
import background from 'src/assets/images/san-francisco-workshop-hero.png'
import slsSanFranLogo from 'src/assets/images/san-francisco-workshop-logo.svg'
import { Image, Row } from 'serverless-design-system'
import CodeOfConductButton from './CodeOfConduct'
import ShareOptions from './ShareOptions'
import WhenAndWhere from './WhenAndWhere'

const EnterpriseWorkshopHero = () => {
  return (
    <React.Fragment>
      <CodeOfConductButton />
      <HeroWrapper
        background={`black url(${background})`}
        backgroundSize='cover'
        backgroundPosition='center'
        height={[581]}
      >
        <ResponsiveStack mb={[2, 2, 4, 9]} mt={[0, 0, 0, 0, 4]}>
          <Box width={[1, 1, 1, 1, 1 / 2]}>
            <Image src={slsSanFranLogo} />
            <Box mt={[5]} width={[1, 1, 0.88]}>
              <P color='gray.2' align={['center', 'center', 'left']}>
                Join us for a full-day workshop preparing you and your team to
                manage and run serverless on an enterprise level that is
                designed for developers with all levels of serverless
                experience.
              </P>
              <Row mt={[4]}>
                <Box mx={['auto', 'auto', 'unset']}>
                  <Button>buy tickets</Button>
                </Box>
                <ShareOptions />
              </Row>
            </Box>
          </Box>
          <WhenAndWhere />
        </ResponsiveStack>
      </HeroWrapper>
    </React.Fragment>
  )
}

export default EnterpriseWorkshopHero