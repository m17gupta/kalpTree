import PageTemplate from "./[slug]/page";

export default async function Page({ params }: any) {

  console.log("parrams---", params)
  return <PageTemplate params={params} />;
}
