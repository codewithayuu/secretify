import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { confession_id, reaction_type, device_id } = await req.json();

    if (!confession_id || !reaction_type || !device_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!['support', 'relate'].includes(reaction_type)) {
      return NextResponse.json(
        { error: 'Invalid reaction type. Must be "support" or "relate"' },
        { status: 400 }
      )
    }

    const { data: existingReaction, error: checkError } = await supabase
      .from('reactions')
      .select('id')
      .eq('confession_id', confession_id)
      .eq('device_id', device_id)
      .eq('reaction_type', reaction_type)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing reaction:', checkError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    let result
    if (existingReaction) {
      const { error: deleteError } = await supabase
        .from('reactions')
        .delete()
        .eq('confession_id', confession_id)
        .eq('device_id', device_id)
        .eq('reaction_type', reaction_type)

      if (deleteError) {
        console.error('Error deleting reaction:', deleteError)
        return NextResponse.json(
          { error: 'Failed to remove reaction' },
          { status: 500 }
        )
      }

      result = { action: 'removed', reaction_type }
    } else {
      const { data, error } = await supabase
        .from("reactions")
        .insert([{ confession_id, reaction_type, device_id }])
        .select();

      if (error) {
        if (error.code === "23505") {
          return NextResponse.json({ message: "Already reacted" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = { action: 'added', reaction_type, data }
    }

    const { data: counts, error: countsError } = await supabase
      .from('reactions')
      .select('reaction_type')
      .eq('confession_id', confession_id)

    if (countsError) {
      console.error('Error getting reaction counts:', countsError)
      return NextResponse.json(
        { error: 'Failed to get reaction counts' },
        { status: 500 }
      )
    }

    const supportCount = counts.filter(r => r.reaction_type === 'support').length
    const relateCount = counts.filter(r => r.reaction_type === 'relate').length

    return NextResponse.json({
      success: true,
      ...result,
      counts: { support_count: supportCount, relate_count: relateCount }
    });

  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { confession_id, reaction_type, device_id } = await req.json();

    if (!confession_id || !reaction_type || !device_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase
      .from("reactions")
      .delete()
      .eq("confession_id", confession_id)
      .eq("reaction_type", reaction_type)
      .eq("device_id", device_id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const confession_id = searchParams.get("confession_id");
    const device_id = searchParams.get("device_id");

    if (!confession_id) {
      return NextResponse.json({ error: "Missing confession_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reactions")
      .select("reaction_type, device_id")
      .eq("confession_id", confession_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const supportCount = data.filter(r => r.reaction_type === 'support').length
    const relateCount = data.filter(r => r.reaction_type === 'relate').length

    let userReactions = { support: false, relate: false }
    if (device_id) {
      const userReactionData = data.filter(r => r.device_id === device_id)
      userReactions = {
        support: userReactionData.some(r => r.reaction_type === 'support'),
        relate: userReactionData.some(r => r.reaction_type === 'relate')
      }
    }

    return NextResponse.json({
      success: true,
      data,
      counts: { support_count: supportCount, relate_count: relateCount },
      userReactions
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }, { status: 400 });
  }
}