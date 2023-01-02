import { Card, Text } from "evergreen-ui";

export default function Section(props: { title: string, children: React.ReactNode }) {
  return (
    <Card display="flex" flexDirection="column" borderColor="black" border={true} width="100%" marginBottom="1rem" padding="2rem">
      <Text fontSize={24} fontWeight={700} marginBottom="1rem">{props.title}</Text>
      {props.children}
    </Card>
  );
}
