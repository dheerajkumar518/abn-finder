"use client";

import type React from "react";

import { useState } from "react";
import xml2js from "xml2js";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sampleXmlData } from "@/lib/sample-xml-data";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { Tables } from "@/database.types";

export default function XmlImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<
    Tables<"australian_business_register">[]
  >([]);
  const [loading, setLoading] = useState(false);

  const supabase = getBrowserSupabase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Limit 1MB to keep parsing quick in-browser
    if (f.size > 1024 * 1024) {
      toast.error("File size exceeds 1MB");
      return;
    }
    setFile(f);
  };

  async function extractData() {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text !== "string") return;
      try {
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(text);

        const abrNodes = result?.root?.ABR ?? result?.ABR ?? [];
        const records: Tables<"australian_business_register">[] = abrNodes.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any) => ({
            abn: Number(item?.ABN?.[0]?._ ?? 0),
            abn_status: String(item?.ABN?.[0]?.$?.status ?? "N/A"),
            company_type: String(item?.EntityType?.[0]?.EntityTypeInd ?? "N/A"),
            company_name: item?.MainEntity
              ? String(
                  item?.MainEntity?.[0]?.NonIndividualName?.[0]
                    ?.NonIndividualNameText ?? "N/A"
                )
              : "N/A",
            gst_status: String(item?.GST?.[0]?.$?.status ?? "N/A"),
            postcode: item?.MainEntity?.[0]?.BusinessAddress?.[0]
              ?.AddressDetails?.[0]?.Postcode?.[0]
              ? Number(
                  item?.MainEntity?.[0]?.BusinessAddress?.[0]
                    ?.AddressDetails?.[0]?.Postcode?.[0]
                )
              : null,
            state:
              item?.MainEntity?.[0]?.BusinessAddress?.[0]?.AddressDetails?.[0]
                ?.State ?? null,
          })
        );

        setExtractedData(
          records.filter(
            (item) =>
              item.abn &&
              item.abn_status &&
              item.company_name &&
              item.company_type &&
              item.gst_status &&
              item.postcode &&
              item.state
          )
        );
        toast.success(`Extracted ${records.length} records`);
      } catch (err) {
        console.error(err);
        toast.error("Error parsing XML file");
      }
    };
    reader.readAsText(file);
  }

  async function handleUpload() {
    if (extractedData.length === 0) return;

    setLoading(true);
    const { error } = await supabase
      .from("australian_business_register")
      .upsert(extractedData, { onConflict: "abn" });

    if (error) {
      console.error(error);
      toast.error("Error uploading data");
    } else {
      toast.success(`Successfully uploaded ${extractedData.length} records`);
      setFile(null);
      setExtractedData([]);
    }
    setLoading(false);
  }

  function handleDownloadSampleFile() {
    const blob = new Blob([sampleXmlData], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-abn.xml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Sample XML file downloaded");
  }

  return (
    <main className="w-full">
      <div className="rounded-3xl border bg-background p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl md:text-2xl font-semibold text-balance">
            Extract ABN Data from XML and Save to Database
          </h1>
          <Button
            variant="link"
            className="text-primary underline"
            onClick={handleDownloadSampleFile}
          >
            Download sample XML
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <Label htmlFor="file" className="text-sm md:text-base font-medium">
            Select XML File
          </Label>
          <div className="relative w-full max-w-md h-32 flex items-center justify-center border-2 border-dashed rounded-2xl text-center">
            <Input
              id="file"
              type="file"
              accept=".xml"
              onChange={handleFileChange}
              disabled={loading}
              className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
            />
            <span className="text-muted-foreground text-sm md:text-base">
              Drag & Drop or Click to Select XML File
            </span>
          </div>

          {file && (
            <div className="w-full max-w-md rounded-xl border p-4 flex flex-col md:flex-row items-center justify-between mt-2 gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium">Selected File</div>
                <div className="text-sm text-muted-foreground break-all">
                  {file.name} • {(file.size / 1024).toFixed(2)} KB
                </div>
              </div>
              <Button
                onClick={extractData}
                disabled={!file || loading}
                className="px-6"
              >
                {loading ? "Working..." : "Extract"}
              </Button>
            </div>
          )}
        </div>

        {extractedData.length > 0 && (
          <div className="mt-8">
            <div className="rounded-xl border max-h-96 overflow-auto">
              <Table>
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
                    <TableRow key={r.abn} className="hover:bg-accent/50">
                      <TableCell className="w-10"></TableCell>
                      <TableCell className="font-medium">
                        {r.company_name.length > 40
                          ? r.company_name.slice(0, 40) + "..."
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
            </div>

            <div className="flex justify-between items-center ">
              <h2>Total Records: {extractedData.length}</h2>
              <Button
                onClick={handleUpload}
                disabled={extractedData.length === 0 || loading}
                className="mt-6"
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
