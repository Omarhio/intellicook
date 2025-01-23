<!-- Test.svelte -->
<script lang="ts">
  import { TextInput, Textarea, Select } from '$lib';
  
  let textValue = '';
  let textareaValue = '';
  let selectValue = '';
  
  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];
</script>

<div class="container mx-auto p-8 space-y-8">
  <h1 class="text-2xl font-title text-[#9d8189] mb-8">Test des composants de formulaire</h1>
  
  <div class="space-y-6 max-w-md">
    <!-- Test TextInput -->
    <div class="space-y-4">
      <h2 class="text-xl font-title text-[#9d8189]">TextInput</h2>
      
      <TextInput
        label="Input normal"
        placeholder="Entrez du texte"
        bind:value={textValue}
      />
      
      <TextInput
        label="Input requis"
        placeholder="Champ obligatoire"
        required
      />
      
      <TextInput
        label="Input avec erreur"
        placeholder="Erreur"
        error="Ce champ contient une erreur"
      />
      
      <TextInput
        label="Input désactivé"
        placeholder="Désactivé"
        disabled
      />
    </div>
    
    <!-- Test Textarea -->
    <div class="space-y-4">
      <h2 class="text-xl font-title text-[#9d8189]">Textarea</h2>
      
      <Textarea
        label="Textarea normal"
        placeholder="Entrez un long texte"
        bind:value={textareaValue}
      />
      
      <Textarea
        label="Textarea avec limite"
        placeholder="Maximum 100 caractères"
        maxlength={100}
      />
      
      <Textarea
        label="Textarea avec erreur"
        error="Ce champ contient une erreur"
      />
    </div>
    
    <!-- Test Select -->
    <div class="space-y-4">
      <h2 class="text-xl font-title text-[#9d8189]">Select</h2>
      
      <Select
        label="Select normal"
        options={selectOptions}
        bind:value={selectValue}
      />
      
      <Select
        label="Select requis"
        options={selectOptions}
        required
      />
      
      <Select
        label="Select avec erreur"
        options={selectOptions}
        error="Une erreur est survenue"
      />
      
      <Select
        label="Select désactivé"
        options={selectOptions}
        disabled
      />
    </div>
  </div>
</div> 