import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const BRAND_PRIMARY = "#3C1418";
const BRAND_GOLD = "#C88785";
const BRAND_BG = "#FCF7F6";
const BRAND_TEXT = "#2A1115";

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: BRAND_BG,
          color: BRAND_TEXT,
          fontFamily: FONT_STACK,
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            padding: "24px 24px 48px",
          }}
        >
          <Section style={{ paddingBottom: "16px", textAlign: "center" }}>
            <Text
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 700,
                color: BRAND_PRIMARY,
                letterSpacing: "0.08em",
              }}
            >
              STYLE BY FIZA
            </Text>
            <Text
              style={{
                margin: "4px 0 0",
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: BRAND_GOLD,
                textTransform: "uppercase",
              }}
            >
              Online Ready to Wear
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#ffffff",
              border: `1px solid ${BRAND_PRIMARY}22`,
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            {children}
          </Section>

          <Hr
            style={{
              marginTop: "32px",
              borderColor: `${BRAND_PRIMARY}14`,
            }}
          />
          <Section style={{ paddingTop: "16px" }}>
            <Text
              style={{
                margin: 0,
                fontSize: "12px",
                lineHeight: "20px",
                color: `${BRAND_TEXT}80`,
              }}
            >
              Style By Fiza · Online Ready to Wear. You received this email because
              you placed an order with us. If you didn’t, please contact us at{" "}
              <Link
                href="mailto:styleby.fiza@gmail.com"
                style={{ color: BRAND_GOLD, textDecoration: "none" }}
              >
                styleby.fiza@gmail.com
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export { Heading, Text, Section, Hr, Link, BRAND_PRIMARY, BRAND_GOLD, BRAND_BG };