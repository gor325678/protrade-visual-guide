
import { supabase } from '@/integrations/supabase/client';
import { Material, MaterialType } from '@/types/material';

export const getAllMaterials = async (): Promise<Material[]> => {
  try {
    console.log('Fetching materials from Supabase...');
    
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('date_added', { ascending: false });

    if (error) {
      console.error('Error fetching materials:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }

    console.log('Materials fetched successfully:', data?.length || 0);
    return data?.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type as MaterialType,
      url: item.url,
      imageUrl: item.image_url,
      dateAdded: new Date(item.date_added)
    })) || [];
  } catch (error) {
    console.error('Error in getAllMaterials:', error);
    return [];
  }
};

export const getMaterialById = async (id: string): Promise<Material | undefined> => {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching material:', error);
      return undefined;
    }

    if (!data) return undefined;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type as MaterialType,
      url: data.url,
      imageUrl: data.image_url,
      dateAdded: new Date(data.date_added)
    };
  } catch (error) {
    console.error('Error in getMaterialById:', error);
    return undefined;
  }
};

export const getImages = async (): Promise<Material[]> => {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('type', 'image')
      .order('date_added', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }

    return data?.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type as MaterialType,
      url: item.url,
      imageUrl: item.image_url,
      dateAdded: new Date(item.date_added)
    })) || [];
  } catch (error) {
    console.error('Error in getImages:', error);
    return [];
  }
};
