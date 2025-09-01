// create a nice component to upload a xml file to extract the data and then save it to the supabase database in australian_business_register table
"use client";
import xml2js from "xml2js";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getBrowserSupabase } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tables } from "@/database.types";
import { sampleXmlData } from "@/lib/sample-xml-data";
const supabase = getBrowserSupabase();

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<
    Tables<"australian_business_register">[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // handle file max size 1mb

    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > 1024 * 1024) {
        toast.error("File size exceeds 1MB");
        return;
      }

      setFile(e.target.files[0]);
    }
  };

  function extracteData() {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        try {
          const parser = new xml2js.Parser();
          const result = await parser.parseStringPromise(text);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const records = result.root.ABR.map((item: any) => ({
            abn: item.ABN[0]._,
            abn_status: item.ABN[0].$.status,
            company_type: item.EntityType[0].EntityTypeInd || "N/A",
            company_name: item.MainEntity
              ? item.MainEntity[0].NonIndividualName[0].NonIndividualNameText
              : "N/A",
            gst_status: item.GST ? item.GST[0].$.status : "N/A",
            postcode: item.MainEntity[0].BusinessAddress[0].AddressDetails[0]
              .Postcode
              ? item.MainEntity[0].BusinessAddress[0].AddressDetails[0]
                  .Postcode[0]
              : 0,
            state: item.MainEntity[0].BusinessAddress[0].AddressDetails[0].State
              ? item.MainEntity[0].BusinessAddress[0].AddressDetails[0].State
              : "N/A",
          }));
          setExtractedData(records);
        } catch (err) {
          console.error(err);
          toast.error("Error parsing XML file");
        }
      }
    };
    reader.readAsText(file);
  }

  const handleUpload = async () => {
    if (extractedData.length === 0) return;
    setLoading(true);
    // upload data to supabase
    const { error } = await supabase
      .from("australian_business_register")
      .upsert(extractedData, { onConflict: "abn" });

    if (error) {
      console.error(error);
      toast.error("Error uploading data");
    } else {
      toast.success(`Successfully uploaded ${12} records`);
      setFile(null);
    }
    setLoading(false);
    setExtractedData([]);
    setFile(null);
  };

  const handleDownloadSampleFile = () => {
    const sampleXml = sampleXmlData;
    const blob = new Blob([sampleXml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-abn.xml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Sample XML file downloaded");
  };

  return (
    <div className="  rounded-3xl shadow-2xl p-10 flex flex-col items-center space-y-8">
      <h1 className="text-3xl font-extrabold  mb-2 tracking-tight">
        Upload ABN XML File
      </h1>
      <div className="w-full flex flex-col items-center space-y-4">
        <Label htmlFor="file" className="text-lg font-semibold ">
          Select XML File
        </Label>
        <div className="relative w-full max-w-md h-32 flex items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl  transition-all duration-200">
          <Input
            type="file"
            id="file"
            accept=".xml"
            onChange={handleFileChange}
            disabled={loading}
            className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
          />
          <span className="text-blue-400 text-xl font-medium">
            Drag & Drop or Click to Select XML File
          </span>
        </div>
        <Button
          variant="link"
          size="sm"
          className="ml-2"
          onClick={handleDownloadSampleFile}
        >
          Download sample XML
        </Button>

        {file && (
          <div className="w-full max-w-md  rounded-xl p-4 flex flex-col md:flex-row items-center justify-between shadow-md mt-2">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              <div className="flex flex-col items-start">
                <span className="text-base font-semibold ">Selected File:</span>
                <span className=" font-medium">{file.name}</span>
              </div>
              <span className="text-sm ">
                Size: {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
            <Button
              className="mt-4 md:mt-0  hover:bg-blue-700  px-6 py-2 rounded-xl shadow"
              onClick={extracteData}
              disabled={!file || loading}
            >
              Extract
            </Button>
          </div>
        )}
      </div>

      {extractedData.length > 0 && (
        <div className="w-full mt-8">
          <Table className="rounded-xl overflow-hidden shadow-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>ABN</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Postcode</TableHead>
                <TableHead>Company Type</TableHead>
                <TableHead>ABN Status</TableHead>
                <TableHead>GST Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extractedData.map((r) => (
                <TableRow
                  key={r.abn}
                  className="hover:bg-blue-50 transition-all"
                >
                  <TableCell className="w-10"></TableCell>
                  <TableCell className="font-medium">
                    {r.company_name.length > 25
                      ? r.company_name.slice(0, 25) + "..."
                      : r.company_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.abn}
                  </TableCell>
                  <TableCell>{r.state ?? "-"}</TableCell>
                  <TableCell>{r.postcode ?? "-"}</TableCell>
                  <TableCell>{r.company_type ?? "-"}</TableCell>
                  <TableCell>{r.abn_status ?? "-"}</TableCell>
                  <TableCell>{r.gst_status ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={extractedData.length === 0 || loading}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-xl shadow"
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
