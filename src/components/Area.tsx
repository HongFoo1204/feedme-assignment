import { Card, CardHeader, Divider, CardBody } from "@nextui-org/react";

interface AreaProps {
  title: string;
  children: React.ReactNode;
}

export default function Area({ title, children }: AreaProps) {
  return (
    <Card className='col-span-4 h-[50vh]'>
      <CardHeader className='flex gap-3'>{title}</CardHeader>
      <Divider />
      <CardBody>{children}</CardBody>
    </Card>
  );
}
